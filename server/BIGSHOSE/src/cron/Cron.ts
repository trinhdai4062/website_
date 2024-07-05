import cron from 'node-cron';
import { DiscountController } from '../controllers/DisscountController';


cron.schedule('* * * * *', async () => { 
    // console.log('Chạy cron job: cập nhật trạng thái discount');
    // await discountController.updateDiscountStatus();
        await DiscountController.updateDiscountStatuses();
   
});

export default cron; 
