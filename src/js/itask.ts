export class TaskBean {
    title: AccessibilityNodeInfo
    desc: AccessibilityNodeInfo
    button: AccessibilityNodeInfo
}

export interface ITask {
    execute(): void;
}

export class TaskWatchVideo implements ITask {
    private mTaskBean: TaskBean

    constructor(item: TaskBean) {
        this.mTaskBean = item
    }

    execute(): void {
        console.log('执行任务：' + this.mTaskBean.title.text, this.mTaskBean.button.text);
        this.mTaskBean.button.click();
        assistant.thread.sleep(1000);       // 1 秒的反应时间
        assistant.thread.sleep(15 * 1000);  // 等待15秒的视频观看时间
        assistant.accessibility.find({id: 'com.xiaopeng.mycarinfo:id/btn_back', class: 'android.widget.ImageView'})[0].click();
    }
}

abstract class TaskWebPage implements ITask {

    protected abstract doExecute();

    execute(): void {
        this.doExecute();
        this.executeBack();
    }

    protected executeBack() {
        let content = assistant.accessibility.find({id: 'android:id/content', class: 'android.widget.FrameLayout'})[0];
        let backBtn = content.child(0).child(0).child(0).child(0).child(0).child(0).child(1).child(0);
        backBtn.click()
    }
}

export class TaskPostRead extends TaskWebPage {
    protected doExecute() {
        assistant.thread.sleep(1000);       // 1 秒的反应时间
        assistant.thread.sleep(15 * 1000);  // 等待15秒的视频观看时间
    }
}

export class TaskPostFollow extends TaskWebPage {
    protected doExecute() {
        assistant.accessibility.find({text: '关注', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.find({text: '已关注', class: 'android.widget.TextView'})[0].click();
        assistant.accessibility.find({text: '确定', id: 'com.xiaopeng.mycarinfo:id/common_alert_dialog_right_text'})[0].click()
    }
}

export class TaskPostThumbUp extends TaskWebPage {
    protected doExecute() {
        assistant.accessibility.find({text: '用观点表明你的态度', class: 'android.widget.TextView'})[0].parent().parent().child(2).click();
        assistant.thread.sleep(2000);
        assistant.accessibility.find({text: '用观点表明你的态度', class: 'android.widget.TextView'})[0].parent().parent().child(2).click();
    }
}

export class TaskPostRead2 extends TaskPostRead {
    protected executeBack() {
        assistant.accessibility.find({id: 'com.xiaopeng.mycarinfo:id/iv_back_icon', class: 'android.widget.ImageView'})[0].click();
    }
}

/**
 * 领取我的奖品
 */
export class TaskCashingPrize extends TaskPostRead2 {
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
    }
}
