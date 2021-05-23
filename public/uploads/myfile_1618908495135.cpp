#include<bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;
using namespace std;
#define ll long long 
#define ff              first
#define ss              second
//#define int             long long
#define pb              push_back
#define mp              make_pair
#define pii             pair<int,int>
#define vi              vector<int>
#define mii             map<int,int>
#define pqb             priority_queue<int>
#define pqs             priority_queue<int,vi,greater<int> >
#define setbits(x)      __builtin_popcountll(x)
#define zrobits(x)      __builtin_ctzll(x)
#define mod             1000000007
#define inf             1e18
#define ps(x,y)         fixed<<setprecision(y)<<x
#define mk(arr,n,type)  type *arr=new type[n];
#define w(x)            int x; cin>>x; while(x--)
mt19937                 rng(chrono::steady_clock::now().time_since_epoch().count());
 
typedef tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> pbds;
 
 
/*void c_p_c()
{
    ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#ifndef ONLINE_JUDGE
    freopen("input.txt", "r", stdin);
    freopen("output.txt", "w", stdout);
#endif
}*/

//int a[1001][1001];

int32_t main()
{
    //c_p_c();
    int t;
    cin>>t;
    //t=1;
    while(t--){
		int n;
		cin>>n;
		long long k;
		cin>>n;
		cin>>k;
		// sum=0;
		
		vector<long long>v(n);
		
		int i=0;
		while(i<n){
			//int temp;
			cin>>v[i];
			//sum+=temp;
			i++;
		}
		  //cout<<sum;
		  
		  sort(v.begin(),v.end());
		  vector<long long>:: iterator upper;
		map<long long, int>mp;
		
		for(i=0;i<n;i++)
		mp[v[i]]++;
		
		int left=0;
		
		
		//int prev=it.second;
		//it++;
		int ans=INT_MAX;
		for(auto it:mp){
			long long rightlimit=it.second+k-1;
			upper=upper_bound(v.begin(),v.end(),rightlimit);
			
			int right=upper-v.begin();
			right=n-right;
			ans=min(ans,left+right);
			
			left+=it.second;
		}
		
		cout<<ans<<endl;
	}
	
	
    return 0;
}
