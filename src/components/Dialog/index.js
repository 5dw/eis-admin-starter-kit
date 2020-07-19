import BasicDialog from './BasicDialog.vue';

const MsgDialog = {};
MsgDialog.install = (Vue) => {
  const MessageDialogInstance = Vue.extend(BasicDialog);

  let MsgDialogInstance;
  const init = () => {
    MsgDialogInstance = new MessageDialogInstance();
    const msgBoxEl = MsgDialogInstance.$mount().$el;
    document.body.appendChild(msgBoxEl);
  };

  Vue.prototype.$MsgDialog = (options) => {
    if (!MsgDialogInstance) {
      init();
    }

    if (typeof options === 'string') {
      MsgDialogInstance.content = options;
    } else if (typeof options === 'object') {
      Object.assign(MsgDialogInstance, options);
    }

    // return MsgDialogInstance.show_msg_box()
    return MsgDialogInstance.show()
      .then((val) => {
        MsgDialogInstance = null;
        return Promise.resolve(val);
      })
      .catch((err) => {
        MsgDialogInstance = null;
        return Promise.reject(err);
      });
  };
};

export default MsgDialog;
