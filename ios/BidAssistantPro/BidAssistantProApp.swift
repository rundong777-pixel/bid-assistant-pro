// BidAssistantProApp.swift
// 招标助手 Pro - 主入口

import SwiftUI

@main
struct BidAssistantProApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var bidStore = BidStore()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(bidStore)
        }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        // 配置导航栏样式
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = .systemBackground
        appearance.titleTextAttributes = [.foregroundColor: UIColor.label]
        
        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().compactAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance
        
        return true
    }
}

// 数据模型
struct Bid: Identifiable, Codable {
    let id: Int
    let source: String
    let source_name: String
    let title: String
    let publish_date: String
    let deadline: String
    let status: String
}

struct BidResponse: Codable {
    let success: Bool
    let count: Int
    let data: [Bid]
}

// 数据存储
class BidStore: ObservableObject {
    @Published var bids: [Bid] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiURL = "https://bid-assistant-pro.vercel.app/api/bids"
    
    func fetchBids() {
        isLoading = true
        errorMessage = nil
        
        guard let url = URL(string: apiURL) else {
            errorMessage = "无效的 URL"
            isLoading = false
            return
        }
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                
                if let error = error {
                    self?.errorMessage = error.localizedDescription
                    return
                }
                
                guard let data = data else {
                    self?.errorMessage = "没有数据"
                    return
                }
                
                do {
                    let response = try JSONDecoder().decode(BidResponse.self, from: data)
                    if response.success {
                        self?.bids = response.data
                    } else {
                        self?.errorMessage = "请求失败"
                    }
                } catch {
                    self?.errorMessage = "解析失败: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
}
