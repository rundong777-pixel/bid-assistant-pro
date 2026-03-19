// ContentView.swift
// 主页面

import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("首页", systemImage: "house")
                }
                .tag(0)
            
            FilterView()
                .tabItem {
                    Label("筛选", systemImage: "line.3.horizontal.decrease")
                }
                .tag(1)
            
            AnalysisView()
                .tabItem {
                    Label("分析", systemImage: "chart.bar")
                }
                .tag(2)
            
            ProfileView()
                .tabItem {
                    Label("我的", systemImage: "person")
                }
                .tag(3)
        }
    }
}

// 首页 - 今日最新招标
struct HomeView: View {
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("今日最新")) {
                    BidRowView(title: "示例招标项目 1", date: "2026-03-19", source: "一汽")
                    BidRowView(title: "示例招标项目 2", date: "2026-03-19", source: "东风")
                    BidRowView(title: "示例招标项目 3", date: "2026-03-18", source: "零跑")
                }
            }
            .navigationTitle("招标助手 Pro")
        }
    }
}

// 招标行视图
struct BidRowView: View {
    let title: String
    let date: String
    let source: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            HStack {
                Text(source)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(4)
                Spacer()
                Text(date)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 4)
    }
}

// 筛选页
struct FilterView: View {
    var body: some View {
        NavigationView {
            Text("筛选功能开发中...")
                .navigationTitle("智能筛选")
        }
    }
}

// 分析页
struct AnalysisView: View {
    var body: some View {
        NavigationView {
            Text("AI 分析功能开发中...")
                .navigationTitle("投标分析")
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
                    Button("升级专业版") {
                        // 打开订阅页面
                    }
                }
                
                Section(header: Text("设置")) {
                    NavigationLink("推送设置") {
                        Text("推送设置页面")
                    }
                    NavigationLink("关键词设置") {
                        Text("关键词设置页面")
                    }
                }
            }
            .navigationTitle("我的")
        }
    }
}
