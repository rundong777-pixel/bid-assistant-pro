import Foundation
import Combine

// 招标数据模型
struct Bid: Identifiable, Codable {
    let id: Int
    let source: String
    let source_name: String
    let title: String
    let content: String?
    let publish_date: String
    let deadline: String?
    let url: String?
    let status: String
    let keywords: [String]?
    let ai_analysis: AIAnalysis?
    let created_at: String
    
    var displayDate: String {
        String(publish_date.prefix(10))
    }
    
    var isActive: Bool {
        status == "active"
    }
}

// AI 分析结果
struct AIAnalysis: Codable {
    let summary: String?
    let recommendation: String?
    let confidence: Double?
    let competitors: [String]?
}

// API 响应
struct BidsResponse: Codable {
    let success: Bool
    let data: [Bid]
    let pagination: Pagination
}

struct Pagination: Codable {
    let page: Int
    let limit: Int
    let total: Int
    let totalPages: Int
}

// 招标详情响应
struct BidDetailResponse: Codable {
    let success: Bool
    let data: Bid
}

// 网络错误
enum NetworkError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case decodingError
    case serverError(String)
    case noData
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "无效的URL"
        case .invalidResponse:
            return "服务器响应无效"
        case .decodingError:
            return "数据解析失败"
        case .serverError(let message):
            return "服务器错误: \(message)"
        case .noData:
            return "暂无数据"
        }
    }
}

// 数据存储类
class BidStore: ObservableObject {
    @Published var bids: [Bid] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    @Published var currentPage = 1
    @Published var totalPages = 1
    @Published var hasMorePages = false
    
    private var cancellables = Set<AnyCancellable>()
    
    // API 基础URL - 部署后替换为实际地址
    private let baseURL = "https://bid-assistant-pro.vercel.app/api"
    
    // 获取招标列表
    func fetchBids(source: String? = nil, keyword: String? = nil, page: Int = 1) {
        isLoading = true
        errorMessage = nil
        
        var components = URLComponents(string: "\(baseURL)/bids")!
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "page", value: String(page)),
            URLQueryItem(name: "limit", value: "20")
        ]
        
        if let source = source, source != "all" {
            queryItems.append(URLQueryItem(name: "source", value: source))
        }
        
        if let keyword = keyword, !keyword.isEmpty {
            queryItems.append(URLQueryItem(name: "keyword", value: keyword))
        }
        
        components.queryItems = queryItems
        
        guard let url = components.url else {
            errorMessage = "无效的URL"
            isLoading = false
            return
        }
        
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: BidsResponse.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] response in
                    if page == 1 {
                        self?.bids = response.data
                    } else {
                        self?.bids.append(contentsOf: response.data)
                    }
                    self?.currentPage = response.pagination.page
                    self?.totalPages = response.pagination.totalPages
                    self?.hasMorePages = response.pagination.page < response.pagination.totalPages
                }
            )
            .store(in: &cancellables)
    }
    
    // 获取招标详情
    func fetchBidDetail(id: Int, completion: @escaping (Result<Bid, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/bid?id=\(id)") else {
            completion(.failure(NetworkError.invalidURL))
            return
        }
        
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: BidDetailResponse.self, decoder: JSONDecoder())
            .map { $0.data }
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { completionResult in
                    if case .failure(let error) = completionResult {
                        completion(.failure(error))
                    }
                },
                receiveValue: { bid in
                    completion(.success(bid))
                }
            )
            .store(in: &cancellables)
    }
    
    // 加载更多
    func loadMore(source: String? = nil, keyword: String? = nil) {
        guard !isLoading, hasMorePages else { return }
        fetchBids(source: source, keyword: keyword, page: currentPage + 1)
    }
    
    // 刷新数据
    func refresh(source: String? = nil, keyword: String? = nil) {
        currentPage = 1
        fetchBids(source: source, keyword: keyword, page: 1)
    }
}
