
const app = getApp()
Page({
  data: {
    img: ''
  },
  onLoad() {
    this.getdata()
  },
getdata(){
  
},
  upload(){
    my.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        
        this.setData({
          img : res.apFilePaths[0]
        })
      },
    });
  }
});
