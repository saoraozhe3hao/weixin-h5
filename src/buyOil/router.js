import Router from 'vue-router'
import ChooseStation from './pages/ChooseStation'
import ChooseGun from './pages/ChooseGun'
import ChoosePlate from './pages/ChoosePlate'
import CreatePlate from './pages/CreatePlate'
import ChooseReceipt from './pages/ChooseReceipt'
import CreateReceipt from './pages/CreateReceipt'
import ChoosePayment from './pages/ChoosePayment'
import ChooseCoupon from './pages/ChooseCoupon'
import PaySuccess from './pages/PaySuccess'

export default new Router({
  routes: [
      {
          path: '/',
          component: ChooseStation
      },
      {
          path: '/choose-gun',
          component: ChooseGun
      },
      {
          path: '/choose-plate',
          component: ChoosePlate
      },
      {
          path: '/create-plate',
          component: CreatePlate
      },
      {
          path: '/choose-receipt',
          component: ChooseReceipt
      },
      {
          path: '/create-receipt',
          component: CreateReceipt
      },
      {
          path: '/choose-payment',
          component: ChoosePayment
      },
      {
          path: '/choose-coupon',
          component: ChooseCoupon
      },
      {
          path: '/pay-success',
          component: PaySuccess
      }
  ]
})
