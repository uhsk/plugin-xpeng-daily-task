import {TaskCashingPrize, TaskClearNotify, TaskWebDailyPage} from "./itask"

if (assistant.app.isInstalled('com.xiaopeng.mycarinfo') == false)
    throw new Error("请先安装小鹏汽车");

assistant.app.run('com.xiaopeng.mycarinfo');
assistant.accessibility.waitActivity('com.xiaopeng.mycarinfo/.business.home.HomeActivity');
assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/tv_tab_text', text: '我的', class: 'android.widget.TextView'})[0].click();
assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/item_title', text: '任务中心', class: 'android.widget.TextView'})[0].click();
assistant.thread.sleep(1000);

try {
    new TaskWebDailyPage().execute();
    new TaskWebDailyPage().execute();
    new TaskWebDailyPage().execute();
    new TaskWebDailyPage().execute();
    new TaskWebDailyPage().execute();
} catch (e) {
    console.error(e);
}

// 领取我的奖金
new TaskCashingPrize().execute();

// 清空通知消息
new TaskClearNotify().execute();

