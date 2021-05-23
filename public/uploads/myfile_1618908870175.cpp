 #include<bits/stdc++.h>
  #include <ext/pb_ds/assoc_container.hpp>
  using namespace __gnu_pbds;
  using namespace std;
  int main()
  {
      int t;cin>>t;
      while(t--){

          int n; cin>>n;
          int arr[n], ans;
          unordered_map<int,int>m;
          for(int i=0;i<n;i++)
          {

           cin>>arr[i];
              m[arr[i]]++;
           }
           for(auto i:m)
           {
               if(i.second==1)
               {
                   for(int j=0;j<n;j++)
                   {
                       if(arr[j]==i.first)
                       {

                           ans=j+1;
                           break;
                       }
                   }
               }
           }
           cout<<ans<<endl;
      }
      return 0;
  }


