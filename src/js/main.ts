import {ITask, TaskBean, TaskCashingPrize, TaskClearNotify, TaskPostFollow, TaskPostRead, TaskPostRead2, TaskPostThumbUp, TaskWatchVideo} from "./itask"

if (assistant.app.isInstalled('com.xiaopeng.mycarinfo') == false)
    throw new Error("请先安装小鹏汽车");
assistant.app.run('com.xiaopeng.mycarinfo');
assistant.accessibility.waitActivity('com.xiaopeng.mycarinfo/.business.home.HomeActivity');
assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/tv_tab_text', text: '我的', class: 'android.widget.TextView'})[0].click();
assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/item_title', text: '任务中心', class: 'android.widget.TextView'})[0].click();
assistant.thread.sleep(1000);

function executeSingleTask() {
    assistant.accessibility.wait({text: '每日任务', class: 'android.widget.TextView'})[0].click();
    assistant.thread.sleep(1000);
    let executeTaskBean: TaskBean = null;
    const ui = assistant.accessibility.all()
    for (let i = 0; i < ui.length; i++) {
        let item = ui[i];
        if (item.text == '去完成') {
            console.log(ui[i + 3].text, ui[i + 2].text, ui[i + 1].text, ui[i].text, ui[i - 1].text, ui[i - 2].text, ui[i - 3].text,)
            executeTaskBean = {title: ui[i - 2], desc: ui[i - 1], button: ui[i]};
            break;
        }
    }

    if (executeTaskBean == null) {
        console.log('全部任务完成');
        return;
    }

    console.log(executeTaskBean.title.text);

    let iTask: ITask = null;
    switch (executeTaskBean.title.text) {
        case '为什么选择小鹏汽车':
            iTask = new TaskWatchVideo(executeTaskBean);
            break;
        case '玩转鹏友生活':
            executeTaskBean.button.click();
            iTask = new TaskPostRead();
            break;
        case '逛一逛门店':
            executeTaskBean.button.click();
            iTask = new TaskPostRead2();
            break;
        case '文章点赞':
            executeTaskBean.button.click();
            iTask = new TaskPostThumbUp();
            break;
        case '关注一个用户':
            executeTaskBean.button.click();
            iTask = new TaskPostFollow();
            break;
    }

    if (iTask != null) {
        iTask.execute();
    }
}

executeSingleTask();
// executeSingleTask();
// executeSingleTask();
// executeSingleTask();
// executeSingleTask();

// 领取我的奖金
new TaskCashingPrize().execute();

// 清空通知消息
new TaskClearNotify().execute();

