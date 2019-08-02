import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/pages/index'
import Me from '@/pages/me/me'
import LeaseOrder from '@/pages/order/leaseOrder'
import BuyOrder from '@/pages/order/buyOrder'
import Order from '@/pages/order/order'
import Shop from '@/pages/shop/shopList'
//产品
import Questionnaire from '@/pages/home/questionnaire'
import Redpacket from '@/pages/home/redpacket'
import Rpfriend from '@/pages/home/rpfriend'
import Goods from '@/pages/home/index_more'
import Extension from '@/pages/home/extension'
import WelfareAgency from '@/pages/home/welfareAgency'
import ProductDetail from '@/pages/home/productDetail'
import WordMouth from '@/pages/home/wordMouth'
import Buy from '@/pages/home/buy'
import Pay from '@/pages/home/pay'
import Agreement from '@/pages/home/agreement'
import Search from '@/pages/home/search'
import PreBuy from '@/pages/home/preBuy'
import FriendBuy from '@/pages/home/friendBuy'
import FriendBuyShare from '@/pages/home/friendBuyShare'
//订单
import Comments from '@/pages/order/comments'
import OrderDetail from '@/pages/order/orderDetail'
import Relet from '@/pages/order/relet'
import Shopping from '@/pages/order/shopping'
import People from '@/pages/order/people'
import LocationList from '@/pages/order/locationList'
import Refund from '@/pages/order/refund'
import AppointmentExpress from '@/pages/order/appointmentExpress'
import Deny from '@/pages/order/deny'
import Calendar from '@/pages/order/calendar'
import Compensation from '@/pages/order/compensation'
import SendBack from '@/pages/order/sendBack'
import Buypay from '@/pages/order/buypay'
import BuyOrderDetail from '@/pages/order/buyOrderDetail'
import FriendRepay from '@/pages/order/friendRepay'

//个人中心
import Rules from '@/pages/me/rules'
import MyInformation from '@/pages/me/myInformation'
import AddInformation from '@/pages/me/addInformation'
import ReceInformation from '@/pages/me/receInformation'
import DetaInformation from '@/pages/me/detaInformation'
import AccountSecurity from '@/pages/me/accountSecurity'
import Coupon from '@/pages/me/coupon'
import Cash from '@/pages/me/cash'
import MyBalance from '@/pages/me/myBalance'
import BankCard from '@/pages/me/bankCard'
import BindingCard from '@/pages/me/bindingCard'
import HelpCenter from '@/pages/me/helpCenter'
import Integral from '@/pages/me/integral'
import Cart from '@/pages/me/cart'
import CommonProblem from '@/pages/me/commonProblem'
import Setup from '@/pages/me/setup'
import AccountBinding from '@/pages/me/accountBinding'
import Modify from '@/pages/me/security/modify'
import Sendcode from '@/pages/me/security/sendcode'
import Newphone from '@/pages/me/security/newphone'
import Newpassword from '@/pages/me/security/newpassword'

//登录
import Login from '@/pages/login/login'
import PasswordLogin from '@/pages/login/passwordLogin'
import ForgetPassword from '@/pages/login/forgetPassword'
import ResetPassword from '@/pages/login/resetPassword'
import InputCode from '@/pages/login/inputCode'
import AliLogin from '@/pages/login/aliLogin'
import SinaLogin from '@/pages/login/sinaLogin'
import WxLogin from '@/pages/login/wxLogin'

//门店
import ShopDetail from '@/pages/shop/shopDetail'
import Map from '@/pages/map'

//免押认证
import Certification from '@/pages/certification/index'
import School from '@/pages/certification/school'
import cPeople from '@/pages/certification/people'
import AddPeople from '@/pages/certification/addPeople'
import Realname from '@/pages/certification/realname'
import RealnameSuc from '@/pages/certification/realnameSuc'
import RealnameUnbundling from '@/pages/certification/realnameUnbundling'
import Face from '@/pages/certification/face'
//托管
import Gohosting from '@/pages/hosting/gohosting/index'
import Steps2 from '@/pages/hosting/gohosting/steps2'
import Fittings from '@/pages/hosting/gohosting/fittings'
import Uploadimg from '@/pages/hosting/gohosting/uploadimg'
import Gsuccessful from '@/pages/hosting/gohosting/successful'

import Trusteeship from '@/pages/hosting/myhosting/trusteeship'
import HostDetail from '@/pages/hosting/myhosting/hostDetail'
import HostCancel from '@/pages/hosting/myhosting/hostCancel'
import PlatformDeli from '@/pages/hosting/myhosting/platformDeli'
import PostDeli from '@/pages/hosting/myhosting/postDeli'
import SceneDeli from '@/pages/hosting/myhosting/sceneDeli'
import HostingDetail from '@/pages/hosting/myhosting/hostingDetail'
import HostingExpress from '@/pages/hosting/myhosting/hostingExpress'
import Nearshop from '@/pages/hosting/myhosting/nearshop'
import NotDetail from '@/pages/hosting/myhosting/notDetail'
import NotPay from '@/pages/hosting/myhosting/pay'

//收货地址
import Addresslist from '@/pages/address/addresslist'
import Addaddress from '@/pages/address/addaddress'

import NotFound from '@/pages/notFound'

Vue.use(Router)

export default new Router({

  routes: [
    { path: '/', component: Index, meta: { title: '首页' } },
    { path: '/shop', component: Shop, meta: { title: '门店', keepAlive: true, isBack: false } },
    { 
      path: '/order', component: Order, meta: { title: '订单' }, 
      children:[
        { path: '', component: LeaseOrder, meta: { title: '订单', keepAlive: true, isBack: false  } },
        { path: 'buyOrder', component: BuyOrder, meta: { title: '订单', keepAlive: true, isBack: false  } },
      ]
    },
    { path: '/me', component: Me, meta: { title: '我的' } },
    //订单
    { path: '/comments/:id/:goodid', component: Comments, meta: { title: '评价' } },
    { path: '/orderDetail/:id', component: OrderDetail, meta: { title: '订单详情' } },
    { path: '/relet/:id', component: Relet, meta: { title: '续租' } },
    { path: '/shopping/:id', component: Shopping, meta: { title: '购买', keepAlive: true, isBack: false } },
    { path: '/people/:type', component: People, meta: { title: '自取联系人' } },
    { path: '/locationList/:type', component: LocationList, meta: { title: '选择地点' } },
    { path: '/locationList/:type/:id', component: LocationList, meta: { title: '选择地点' } },
    { path: '/refund/:id', component: Refund, meta: { title: '退租' } },
    { path: '/appointmentExpress/:id', component: AppointmentExpress, meta: { title: '预约快递' } },
    { path: '/deny/:id', component: Deny, meta: { title: '否认' } },
    { path: '/calendar/:type', component: Calendar, meta: { title: '时间' } },
    { path: '/calendar/:type/:type1', component: Calendar, meta: { title: '时间' } },
    { path: '/compensation/:id', component: Compensation, meta: { title: '维修费' } },
    { path: '/sendBack/:id', component: SendBack, meta: { title: '自行寄回' } },
    { path: '/buypay/:id', component: Buypay, meta: { title: '支付' } },
    { path: '/buyOrderDetail/:id', component: BuyOrderDetail, meta: { title: '订单详情' } },
    { path: '/friendRepay', component: FriendRepay, meta: { title: '朋友代还' } },
    //产品&&首页
    { path: '/goods/:id', component: Goods, meta: { title: '产品列表', keepAlive: true, isBack: false  } },
    { path: '/extension', component: Extension, meta: { title: '推广收佣' } },
    { path: '/welfareAgency', component: WelfareAgency, meta: { title: '领取福利' } },
    { path: '/questionnaire', component: Questionnaire, meta: { title: '问卷调查' } },
    { path: '/redpacket', component: Redpacket, meta: { title: '抢红包' } },
    { path: '/rpfriend', component: Rpfriend, meta: { title: '抢红包-好友助力' } },
    { path: '/productDetail/:id', component: ProductDetail, meta: { title: 'SKU信息' } },
    { path: '/wordMouth/:id', component: WordMouth, meta: { title: '口碑' } },
    { path: '/buy', component: Buy, meta: { title: '下单', keepAlive: true, isBack: false  } },
    { path: '/pay/:orderid', component: Pay, meta: { title: '额度' } },
    { path: '/zagreement/:title', component: Agreement, meta: { title: '协议' } },
    { path: '/search', component: Search, meta: { title: '搜索', keepAlive: true, isBack: false } },
    { path: '/preBuy', component: PreBuy, meta: { title: '预下单', keepAlive: true, isBack: false } }, 
    { path: '/friendBuy', component: FriendBuy, meta: { title: '朋友送礼-下单', keepAlive: true, isBack: false } }, 
    { path: '/friendBuyShare', component: FriendBuyShare, meta: { title: '朋友送礼-朋友填写' } }, 

    //个人中心
    { path: '/rules/:title', component: Rules, meta: { title: '规则' } },
    { path: '/myInformation', component: MyInformation, meta: { title: '我的资料' } },
    { path: '/receInformation', component: ReceInformation, meta: { title: '收货信息' } },
    { path: '/addInformation/:id', component: AddInformation, meta: { title: '编辑收货信息' } },
    { path: '/addInformation', component: AddInformation, meta: { title: '添加收货信息' } },
    { path: '/detaInformation', component: DetaInformation, meta: { title: '详细信息' } },
    { path: '/accountSecurity', component: AccountSecurity, meta: { title: '账号安全' } },
    { path: '/modify/:type/:phone', component: Modify, meta: { title: '当前绑定手机号' } },
    { path: '/coupon', component: Coupon, meta: { title: '优惠券' } },
    { path: '/myBalance', component: MyBalance, meta: { title: '我的余额' } },
    { path: '/cash', component: Cash, meta: { title: '提现' } },
    { path: '/bankCard', component: BankCard, meta: { title: '银行卡' } },
    { path: '/bindingCard', component: BindingCard, meta: { title: '绑定银行卡' } },
    { path: '/helpCenter', component: HelpCenter, meta: { title: '帮助中心' } },
    { path: '/integral', component: Integral, meta: { title: '我的积分' } },
    { path: '/cart', component: Cart, meta: { title: '购物车' } },
    { path: '/commonProblem', component: CommonProblem, meta: { title: '常见问题' } },
    { path: '/setup', component: Setup, meta: { title: '设置' } },
    { path: '/accountBinding', component: AccountBinding, meta: { title: '账号绑定' } },
    { path: '/sendcode/:type/:phone', component: Sendcode, meta: { title: '发送验证码' } },
    { path: '/newphone', component: Newphone, meta: { title: '绑定新手机号' } },
    { path: '/newpassword', component: Newpassword, meta: { title: '修改密码' } },

    //登录
    { path: '/login', component: Login, meta: { title: '登录' } },
    { path: '/passwordLogin', component: PasswordLogin, meta: { title: '密码登录' } },
    { path: '/forgetPassword', component: ForgetPassword, meta: { title: '忘记密码' } },
    { path: '/resetPassword/:phone', component: ResetPassword, meta: { title: '重置密码' } },
    { path: '/inputCode/:phone', component: InputCode, meta: { title: '输入验证码' } },
    { path: '/alilogin', component: AliLogin, meta: { title: '授权' } },
    { path: '/sinalogin', component: SinaLogin, meta: { title: '授权' } },
    { path: '/wxlogin', component: WxLogin, meta: { title: '授权' } },

    //门店
    { path: '/shopDetail', component: ShopDetail, meta: { title: '门店详情' } },

    //免押认证
    { path: '/certification', component: Certification, meta: { title: '认证中心' } },
    { path: '/school', component: School, meta: { title: '学籍认证' } },
    { path: '/cpeople', component: cPeople, meta: { title: '添加紧急联系人' } },
    { path: '/addPeople', component: AddPeople },
    { path: '/addPeople/:id', component: AddPeople },
    { path: '/realname', component: Realname, meta: { title: '实名认证' } },
    { path: '/realnameSuc', component: RealnameSuc, meta: { title: '实名认证' } },
    { path: '/realnameUnbundling', component: RealnameUnbundling, meta: { title: '解绑实名认证' } },
    { path: '/face/:orderid', component: Face, meta: { title: '人脸识别' } },

    //托管
    { path: '/gohosting', component: Gohosting, meta: { title: '托管理财' } },
    { path: '/steps2', component: Steps2, meta: { title: '托管理财' } },
    { path: '/fittingsConfirm', component: Fittings, meta: { title: '配件确认' } },
    { path: '/uploadimg', component: Uploadimg, meta: { title: '上传照片', keepAlive: true, isBack: false } },
    { path: '/gsuccessful', component: Gsuccessful, meta: { title: '提交成功' } },

    { path: '/trusteeship', component: Trusteeship, meta: { title: '我的托管', keepAlive: true, isBack: false } },
    { path: '/hostDetail/:id', component: HostDetail, meta: { title: '审核详情' } },
    { path: '/hostCancel/:id/:number', component: HostCancel, meta: { title: '取消托管' } },
    { path: '/sceneDeli/:id', component: SceneDeli, meta: { title: '现场交付' } },
    { path: '/platformDeli/:id', component: PlatformDeli, meta: { title: '平台配送' } },
    { path: '/postDeli/:id', component: PostDeli, meta: { title: '快递交付' } },
    { path: '/hostingDetail/:id', component: HostingDetail, meta: { title: '托管详情' } },
    { path: '/hostingExpress/:id', component: HostingExpress, meta: { title: '审核详情' } },
    { path: '/nearshop', component: Nearshop, meta: { title: '选择门店' } },
    { path: '/notDetail/:id', component: NotDetail, meta: { title: '详情' } },
    { path: '/notpay/:id', component: NotPay, meta: { title: '支付' } },

    //收货地址
    { path: '/addresslist/:type', component: Addresslist, meta: { title: '收货地址' } },
    { path: '/addaddress', component: Addaddress, meta: { title: '添加收货地址' } },
    { path: '/addaddress/:id', component: Addaddress, meta: { title: '编辑收货地址' } },

    //地图
    { path: '/map/:center/:shop', component: Map, meta: { title: '地图' } },

    { path: '*', component: NotFound, meta: { title: '404-not found' } },

  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }

})