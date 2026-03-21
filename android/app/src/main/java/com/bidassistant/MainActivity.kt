// MainActivity.kt
package com.bidassistant

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            BidAssistantApp()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BidAssistantApp() {
    var selectedTab by remember { mutableIntStateOf(0) }
    val snackbarHostState = remember { SnackbarHostState() }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("招标助手 Pro") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "首页") },
                    label = { Text("首页") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.FilterList, contentDescription = "筛选") },
                    label = { Text("筛选") },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Star, contentDescription = "收藏") },
                    label = { Text("收藏") },
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "我的") },
                    label = { Text("我的") },
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 }
                )
            }
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        when (selectedTab) {
            0 -> HomeScreen(modifier = Modifier.padding(padding))
            1 -> FilterScreen(modifier = Modifier.padding(padding))
            2 -> FavoritesScreen(modifier = Modifier.padding(padding))
            3 -> ProfileScreen(modifier = Modifier.padding(padding))
        }
    }
}

@Composable
fun HomeScreen(modifier: Modifier = Modifier) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }
    var bids by remember { mutableStateOf<List<Bid>>(emptyList()) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    LaunchedEffect(Unit) {
        isLoading = true
        try {
            bids = fetchBids()
        } catch (e: Exception) {
            errorMessage = e.message
        } finally {
            isLoading = false
        }
    }
    
    Box(modifier = modifier.fillMaxSize()) {
        when {
            isLoading -> {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            errorMessage != null -> {
                ErrorView(
                    message = errorMessage!!,
                    onRetry = {
                        scope.launch {
                            isLoading = true
                            try {
                                bids = fetchBids()
                                errorMessage = null
                            } catch (e: Exception) {
                                errorMessage = e.message
                            } finally {
                                isLoading = false
                            }
                        }
                    },
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            bids.isEmpty() -> {
                EmptyView(modifier = Modifier.align(Alignment.Center))
            }
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(bids) { bid ->
                        BidCard(bid = bid)
                    }
                }
            }
        }
    }
}

@Composable
fun BidCard(bid: Bid) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                SourceTag(source = bid.sourceName)
                Text(
                    text = bid.publishDate.substring(0, 10),
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = bid.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Medium,
                maxLines = 2
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "截止: ${bid.deadline?.substring(0, 10) ?: "未设置"}",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFFFF9800)
                )
                StatusTag(status = bid.status)
            }
        }
    }
}

@Composable
fun SourceTag(source: String) {
    val color = when (source) {
        "一汽" -> Color(0xFFE53935)
        "东风" -> Color(0xFF1E88E5)
        "零跑" -> Color(0xFF43A047)
        else -> Color.Gray
    }
    
    Surface(
        color = color.copy(alpha = 0.15f),
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = source,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun StatusTag(status: String) {
    val (text, color) = if (status == "active") {
        "进行中" to Color(0xFF4CAF50)
    } else {
        "已结束" to Color.Gray
    }
    
    Surface(
        color = color.copy(alpha = 0.15f),
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            style = MaterialTheme.typography.labelSmall,
            color = color
        )
    }
}

@Composable
fun ErrorView(message: String, onRetry: () -> Unit, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.Error,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = Color(0xFFFF9800)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) {
            Text("重试")
        }
    }
}

@Composable
fun EmptyView(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.Search,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = Color.Gray
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "暂无招标信息",
            style = MaterialTheme.typography.bodyLarge,
            color = Color.Gray
        )
    }
}

@Composable
fun FilterScreen(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.Default.FilterList,
                contentDescription = null,
                modifier = Modifier.size(80.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "智能筛选功能",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "根据关键词、时间、来源筛选招标信息",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun FavoritesScreen(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.Default.Star,
                contentDescription = null,
                modifier = Modifier.size(80.dp),
                tint = Color(0xFFFFC107)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "我的收藏",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "收藏的招标信息将显示在这里",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun ProfileScreen(modifier: Modifier = Modifier) {
    Column(modifier = modifier.fillMaxSize()) {
        ListItem(
            headlineContent = { Text("当前套餐") },
            trailingContent = { Text("免费版", color = Color.Gray) }
        )
        Divider()
        ListItem(
            headlineContent = { Text("升级专业版", color = MaterialTheme.colorScheme.primary) },
            trailingContent = { Icon(Icons.Default.ChevronRight, null) }
        )
        Divider()
        ListItem(
            headlineContent = { Text("推送设置") },
            trailingContent = { Icon(Icons.Default.ChevronRight, null) }
        )
        Divider()
        ListItem(
            headlineContent = { Text("关键词设置") },
            trailingContent = { Icon(Icons.Default.ChevronRight, null) }
        )
        Divider()
        ListItem(
            headlineContent = { Text("关于") },
            trailingContent = { Icon(Icons.Default.ChevronRight, null) }
        )
    }
}

// 数据模型
data class Bid(
    val id: Int,
    val source: String,
    val sourceName: String,
    val title: String,
    val content: String?,
    val publishDate: String,
    val deadline: String?,
    val url: String?,
    val status: String,
    val keywords: List<String>?,
    val createdAt: String
)

// 模拟数据获取
suspend fun fetchBids(): List<Bid> {
    // 实际部署后替换为真实 API 调用
    return listOf(
        Bid(
            id = 1,
            source = "leapmotor",
            sourceName = "零跑",
            title = "2026年度营销活动策划服务采购项目",
            content = null,
            publishDate = "2026-03-20T10:00:00Z",
            deadline = "2026-04-20T17:00:00Z",
            url = "https://cn.leapmotor.com/join/callForBids.html",
            status = "active",
            keywords = listOf("营销", "活动"),
            createdAt = "2026-03-20T10:00:00Z"
        ),
        Bid(
            id = 2,
            source = "faw",
            sourceName = "一汽",
            title = "新能源汽车电池供应商招标公告",
            content = null,
            publishDate = "2026-03-19T08:00:00Z",
            deadline = "2026-04-15T17:00:00Z",
            url = "https://etp.faw.cn/",
            status = "active",
            keywords = listOf("新能源", "电池"),
            createdAt = "2026-03-19T08:00:00Z"
        ),
        Bid(
            id = 3,
            source = "dongfeng",
            sourceName = "东风",
            title = "智能驾驶系统研发项目合作招标",
            content = null,
            publishDate = "2026-03-18T14:00:00Z",
            deadline = "2026-04-10T17:00:00Z",
            url = "https://etp.dfmc.com.cn/",
            status = "active",
            keywords = listOf("智能驾驶", "研发"),
            createdAt = "2026-03-18T14:00:00Z"
        )
    )
}
