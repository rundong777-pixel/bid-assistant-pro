// ContentView.swift
// 主页面

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var bidStore: BidStore
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("首页", systemImage: "house.fill")
                }
                .tag(0)
            
            FilterView()
                .tabItem {
                    Label("筛选", systemImage: "line.3.horizontal.decrease.circle.fill")
                }
                .tag(1)
            
            FavoritesView()
                .tabItem {
                    Label("收藏", systemImage: "star.fill")
                }
                .tag(2)
            
            ProfileView()
                .tabItem {
                    Label("我的", systemImage: "person.fill")
                }
                .tag(3)
        }
        .accentColor(.blue)
    }
}

// 首页 - 招标列表
struct HomeView: View {
    @EnvironmentObject var bidStore: BidStore
    
    var body: some View {
        NavigationView {
            Group {
                if bidStore.isLoading {
                    ProgressView("加载中...")
                } else if let error = bidStore.errorMessage {
                    ErrorView(message: error, retryAction: {
                        bidStore.fetchBids()
                    })
                } else if bidStore.bids.isEmpty {
                    EmptyView()
                } else {
                    BidListView(bids: bidStore.bids)
                }
            }
            .navigationTitle("招标助手 Pro")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        bidStore.fetchBids()
                    }) {
                        Image(systemName: "arrow.clockwise")
                    }
                }
            }
        }
        .onAppear {
            bidStore.fetchBids()
        }
    }
}

// 招标列表视图
struct BidListView: View {
    let bids: [Bid]
    
    var body: some View {
        List(bids) { bid in
            BidRowView(bid: bid)
        }
        .listStyle(InsetGroupedListStyle())
    }
}

// 招标行视图
struct BidRowView: View {
    let bid: Bid
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                SourceTag(name: bid.source_name)
                Spacer()
                Text(bid.publish_date)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Text(bid.title)
                .font(.system(size: 16, weight: .medium))
                .lineLimit(2)
            
            HStack {
                Label("截止: \(bid.deadline)", systemImage: "calendar")
                    .font(.caption)
                    .foregroundColor(.orange)
                Spacer()
                StatusTag(status: bid.status)
            }
        }
        .padding(.vertical, 4)
    }
}

// 来源标签
struct SourceTag: View {
    let name: String
    
    var color: Color {
        switch name {
        case "一汽": return .red
        case "东风": return .blue
        case "零跑": return .green
        default: return .gray
        }
    }
    
    var body: some View {
        Text(name)
            .font(.caption)
            .fontWeight(.bold)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15))
            .foregroundColor(color)
            .cornerRadius(4)
    }
}

// 状态标签
struct StatusTag: View {
    let status: String
    
    var body: some View {
        Text(status == "active" ? "进行中" : "已结束")
            .font(.caption)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(status == "active" ? Color.green.opacity(0.15) : Color.gray.opacity(0.15))
            .foregroundColor(status == "active" ? .green : .gray)
            .cornerRadius(4)
    }
}

// 错误视图
struct ErrorView: View {
    let message: String
    let retryAction: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 50))
                .foregroundColor(.orange)
            
            Text(message)
                .multilineTextAlignment(.center)
                .foregroundColor(.gray)
            
            Button("重试", action: retryAction)
                .buttonStyle(.bordered)
        }
        .padding()
    }
}

// 空视图
struct EmptyView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "doc.text.magnifyingglass")
                .font(.system(size: 50))
                .foregroundColor(.gray)
            
            Text("暂无招标信息")
                .foregroundColor(.gray)
        }
        .padding()
    }
}

// 筛选页
struct FilterView: View {
    var body: some View {
        NavigationView {
            VStack {
                Image(systemName: "line.3.horizontal.decrease.circle")
                    .font(.system(size: 60))
                    .foregroundColor(.blue)
                    .padding()
                
                Text("智能筛选功能")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text("根据关键词、时间、来源筛选招标信息")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding()
                
                Spacer()
            }
            .navigationTitle("筛选")
        }
    }
}

// 收藏页
struct FavoritesView: View {
    var body: some View {
        NavigationView {
            VStack {
                Image(systemName: "star")
                    .font(.system(size: 60))
                    .foregroundColor(.yellow)
                    .padding()
                
                Text("我的收藏")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text("收藏的招标信息将显示在这里")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding()
                
                Spacer()
            }
            .navigationTitle("收藏")
        }
    }
}

// 个人中心
struct ProfileView: View {
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("订阅")) {
                    HStack {
                        Text("当前套餐")
                        Spacer()
                        Text("免费版")
                            .foregroundColor(.gray)
                    }
                    
                    Button(action: {}) {
                        HStack {
                            Text("升级专业版")
                                .foregroundColor(.blue)
                            Spacer()
                            Image(systemName: "chevron.right")
                                .foregroundColor(.gray)
                        }
                    }
                }
                
                Section(header: Text("设置")) {
                    NavigationLink("推送设置") {
                        Text("推送设置页面")
                    }
                    
                    NavigationLink("关键词设置") {
                        Text("关键词设置页面")
                    }
                    
                    NavigationLink("关于") {
                        AboutView()
                    }
                }
            }
            .listStyle(InsetGroupedListStyle())
            .navigationTitle("我的")
        }
    }
}

// 关于页面
struct AboutView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "doc.text.magnifyingglass")
                .font(.system(size: 80))
                .foregroundColor(.blue)
            
            Text("招标助手 Pro")
                .font(.title)
                .fontWeight(.bold)
            
            Text("版本 1.0.0")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            Text("专业的招标信息监控与分析工具")
                .font(.body)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding()
            
            Spacer()
        }
        .padding()
        .navigationTitle("关于")
    }
}
