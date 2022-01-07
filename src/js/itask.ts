class TaskBean {
    title: AccessibilityNodeInfo
    desc: AccessibilityNodeInfo
    button: AccessibilityNodeInfo
}

interface ITask {
    execute(): void;
}

/**
 * 基础页面任务类型
 */
abstract class TaskPageBase implements ITask {
    execute() {
        this.doExecute();
        this.doBack();
    }

    protected abstract doExecute();

    protected abstract doBack();
}

/**
 * 基础网页风格类型1
 */
abstract class TaskWebPage1 extends TaskPageBase {
    protected doBack() {
        let content = assistant.accessibility.find({id: 'android:id/content', class: 'android.widget.FrameLayout'})[0];
        let backBtn = content.child(0).child(0).child(0).child(0).child(0).child(0).child(1).child(0);
        backBtn.click()
    }
}

/**
 * 基础网页风格类型2
 */
abstract class TaskWebPage2 extends TaskPageBase {
    protected doBack() {
        assistant.accessibility.find({id: 'com.xiaopeng.mycarinfo:id/iv_back_icon', class: 'android.widget.ImageView'})[0].click();
    }
}

/**
 * 基础网页风格类型2
 */
abstract class TaskWebPage3 extends TaskPageBase {
    protected doBack() {
        assistant.accessibility.find({id: 'com.xiaopeng.mycarinfo:id/btn_back', class: 'android.widget.ImageView'})[0].click();
    }
}

class TaskPostRead extends TaskWebPage1 {
    protected doExecute() {
        assistant.thread.sleep(1000);       // 1 秒的反应时间
        assistant.thread.sleep(15 * 1000);  // 等待15秒的视频观看时间
    }
}

class TaskPostRead2 extends TaskWebPage2 {
    protected doExecute() {
        assistant.thread.sleep(1000);       // 1 秒的反应时间
        assistant.thread.sleep(15 * 1000);  // 等待15秒的视频观看时间
    }
}

class TaskPostFollow extends TaskWebPage1 {
    protected doExecute() {
        assistant.accessibility.find({text: '关注', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.find({text: '已关注', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.find({text: '确定', id: 'com.xiaopeng.mycarinfo:id/common_alert_dialog_right_text'})[0].click()
    }
}

class TaskPostThumbUp extends TaskWebPage1 {
    protected doExecute() {
        assistant.accessibility.find({text: '用观点表明你的态度', class: 'android.widget.TextView'})[0].parent().parent().child(2).click();
        assistant.thread.sleep(2000);
        assistant.accessibility.find({text: '用观点表明你的态度', class: 'android.widget.TextView'})[0].parent().parent().child(2).click();
    }
}

class TaskWatchVideo extends TaskWebPage3 {
    protected doExecute() {
        assistant.thread.sleep(1000);       // 1 秒的反应时间
        assistant.thread.sleep(15 * 1000);  // 等待15秒的视频观看时间
    }
}

/**
 * 领取我的奖品
 */
export class TaskCashingPrize extends TaskWebPage2 {
    protected doExecute() {
        assistant.accessibility.all().filter(item => item.text == 'animation' && item.class == 'android.widget.Button')[0].parent().child(2).click();
        assistant.accessibility.wait({text: '一键领取', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.wait({text: '暂无内容', class: 'android.widget.TextView'});
    }
}

/**
 * 清空通知
 */
export class TaskClearNotify implements ITask {
    execute(): void {
        assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/tv_tab_text', text: '鹏友', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/tv_notice_title', text: '积分到账通知', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.wait({id: 'com.xiaopeng.mycarinfo:id/tv_message_desc', text: '积分到账通知', class: 'android.widget.TextView'})[0].click();

        assistant.thread.sleep(1000);
        assistant.accessibility.find({id: 'com.xiaopeng.mycarinfo:id/msg_toolbar', class: 'android.widget.RelativeLayout'})[0].child(0).click();
        assistant.thread.sleep(1000);
        assistant.accessibility.find({id: 'com.xiaopeng.mycarinfo:id/msg_toolbar', class: 'android.widget.RelativeLayout'})[0].child(0).click();
        assistant.thread.sleep(1000);
    }
}

/**
 * 每日任务的Web界面，每次执行一个任务
 */
export class TaskWebDailyPage extends TaskWebPage1 {
    protected doExecute() {
        assistant.accessibility.wait({text: '每日任务', class: 'android.widget.TextView'})[0].click();
        assistant.thread.sleep(1000);
        let executeTaskBean: TaskBean = null;
        const ignoreLottery: boolean = 1 - 1 == 0;        // 是否忽略抽奖
        const nodeInfos = assistant.accessibility.all()
        for (let i = 0; i < nodeInfos.length; i++) {
            let item = nodeInfos[i];
            if (item.text == '去完成') {
                if (ignoreLottery == true && nodeInfos[i - 2].text == '每日抽奖') {
                    continue;
                }
                executeTaskBean = {title: nodeInfos[i - 2], desc: nodeInfos[i - 1], button: nodeInfos[i]};
                break;
            }
        }

        if (executeTaskBean == null) {
            throw new Error('全部任务完成');
        }

        console.log(executeTaskBean.title.text);

        let iTask: ITask = null;
        switch (executeTaskBean.title.text) {
            case '为什么选择小鹏汽车':
                executeTaskBean.button.click();
                iTask = new TaskWatchVideo();
                break;
            case '玩转鹏友生活':
                executeTaskBean.button.click();
                iTask = new TaskPostRead();
                break;
            case '逛一逛门店':
            case '看一看二手车页面':
            case '小鹏精选好物':
            case '加入鹏友会，领取专属福利':
            case '领略X-walker志愿者风采':
            case '浏览精彩鹏友活动':
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
            case '每日抽奖':
                break;
        }

        if (iTask != null) {
            iTask.execute();
        }

    }
}
