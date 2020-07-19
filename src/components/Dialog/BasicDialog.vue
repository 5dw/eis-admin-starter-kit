<template>
  <q-dialog
    persistent
    ref="dialog"
  >
    <q-card
      :class="['basic-dialog-card', dialogClass]"
      :style="`height: ${size.h}px; min-height: ${size.h};
         width: ${size.w}px; min-height: ${size.w}`"
    >
      <q-card-section class="column items-center">
        <e-icon
          v-if="type"
          class="dialog-icon"
          :name="icon || type"
          alt=""
        />
        <div
          v-if="content"
          class="title"
        >{{ content }}</div>
        <div
          v-if="tips"
          class="tips"
        >{{ tips }}</div>
        <!-- <div
          v-if="warning"
          class="warning"
        >{{ warning }}</div> -->
        <div
          v-if="warning"
          class="warning no-wrap"
        >
          <span class="warning-icon"></span>
          <span class="warning-icon-sign-top"></span>
          <span class="warning-icon-sign-dot"></span>
          <span class="warning-text ellipsis">{{warning}}</span>
        </div>

        <q-input
          v-if="needText"
          hide-bottom-space
          class="full-width"
          :placeholder="text_label"
          :maxlength="max_text_length"
          v-model="textContent"
          :rows="max_text_length / 20"
          :class="textValid ? '' : 'invalid'"
          type="textarea"
        >
        </q-input>
        <span v-if="needText">{{ textContent.length }}/{{ max_text_length }}</span>
        <div
          v-if="fields && fields.length"
          :class="fieldsClass || ''"
        >
          <input-field
            :class="field.class || ''"
            v-for="(field, index) in fields"
            :key="index"
            :Field="field"
            :values="fieldsData"
            :ref="`input_field_validator_${index}`"
          ></input-field>
        </div>
        <slot name="fields"></slot>
      </q-card-section>

      <q-card-actions
        align="center"
        class="action-buttons full-width absolute"
        style="bottom: 10px"
      >
        <q-btn
          :label="cancelText"
          class="cancel-btn"
          v-close-popup
          @click="btnCancel"
          v-if="canCancel"
        />
        <q-btn
          :label="okText"
          class="ok-btn"
          :class="okDisabled ? 'disabled-ok-btn' : ''"
          :disabled="okDisabled"
          @click="onOKClick"
        >
          <span v-if="timeLeft">({{ timeLeft }}s)</span>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import mixins from 'eis-admin-mixins';

export default {
  name: 'BasicDialog',
  mixins: [mixins.InputFieldValidator],
  props: {
    type: { type: String, default: 'info' },
    icon: { type: String, default: '' },
    textAlign: { type: String, default: 'center' },
    content: { type: String, default: '' },
    tips: { type: String, default: '' },
    size: {
      type: Object,
      default: () => ({
        h: 300,
        w: 550,
      }),
    },
    needText: { type: Boolean, default: false },
    text_label: { type: String, default: '' },
    max_text_length: { type: Number, default: 100 },
    canCancel: { type: Boolean, default: false },
    cancelText: { type: String, default: 'Cancel' },
    cancelType: { type: String, default: '' },
    okDisabled: { type: Boolean, default: false },
    okText: { type: String, default: 'OK' },
    okType: { type: String, default: '' },
    timeout: { type: Number, default: 0 },
    showWarning: { type: Boolean, default: true },
    warning: { type: String, default: '' },
    // validateFunc: {
    //   type: Function,
    //   default: () => true,
    // },
    visible: { type: Boolean, default: true },
    fields: { type: Array, default: () => ([]) },
    fieldsData: { type: Object, default: () => ({}) },
    fieldsClass: { type: String, default: '' },
    dialogClass: { type: String, default: '' },
  },
  data() {
    return {
      timeLeft: 0,
      textContent: '',
      textValid: true,
      timer: undefined,
      promise: '',
      resolve: '',
      reject: '',
    };
  },
  // created() {
  //   if (this.visible) {
  //     this.show();
  //   } else {
  //     this.hide();
  //   }
  // },
  watch: {
    visible() {
      if (this.visible) {
        this.timeout_counter();
        this.show();
      } else {
        this.hide();
      }
    },
  },
  computed: {
    warningMsg() {
      // 设置默认warning
      if (!this.showWarning) return '';

      if (!this.warning) {
        // if (store.getters.isAdmin) {
        //   return '请谨慎操作管理员权限';
        // }
        // if (store.getters.isGroup) {
        //   return '请谨慎操作核心企业权限';
        // }
        return '';
      }
      return this.warning;
    },
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
      this.timeout_counter();

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });

      return this.promise;
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide');
    },
    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      // this.$emit('ok');
      // or with payload: this.$emit('ok', { ... })

      // // validate
      // if (this.validateFunc && typeof this.validateFunc === 'function') {
      //   // now we only have such content, but later we might will have more
      //   this.textValid = this.validateFunc(this.textContent);
      //   if (!this.textValid) return;
      // }
      if (!this.validate()) {
        return;
      }

      this.$emit('ok');

      if (this.timer) {
        this.timeLeft = 0;
        clearInterval(this.timer);
      }

      if (this.resolve) {
        if (this.needText) {
          this.resolve(this.textContent);
        } else {
          this.resolve('confirm');
        }

        this.hide();
        this.remove();
      }
    },
    // show_msg_box() {
    //   this.show();
    //   this.promise = new Promise((resolve, reject) => {
    //     this.resolve = resolve;
    //     this.reject = reject;
    //   });

    //   return this.promise;
    // },
    btnCancel() {
      this.$emit('cancel');

      if (this.timer) {
        this.timeLeft = 0;
        clearInterval(this.timer);
      }

      if (this.reject) {
        this.reject('cancel');
        this.remove();
      }
    },
    btn_ok() {
      // // validate
      // if (this.validateFunc && typeof this.validateFunc === 'function') {
      //   // now we only have such content, but later we might will have more
      //   this.textValid = this.validateFunc(this.textContent);
      //   if (!this.textValid) return;
      // }
      if (!this.validate()) {
        return;
      }

      this.$emit('ok');

      if (this.timer) {
        this.timeLeft = 0;
        clearInterval(this.timer);
      }

      if (this.resolve) {
        if (this.needText) {
          this.resolve(this.textContent);
        } else {
          this.resolve('confirm');
        }

        this.hide();
        this.remove();
      }
    },
    timeout_counter() {
      if (!this.timeout) {
        return;
      }

      this.timeLeft = this.timeout;
      this.timer = setInterval(() => {
        this.timeLeft = this.timeLeft - 1;
        this.timeLeft -= 1;
        if (this.timeLeft < 1) {
          clearInterval(this.timer);
          this.btn_ok();
        }
      }, 1000);
    },
    remove() {
      this.$destroy();
      document.body.removeChild(this.$el);
    },
  },
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.basic-dialog-card {
  min-height: 200px;
  min-width: 480px;
}

.q-dialog__inner--minimized > div {
  max-width: unset;
}

.dialog-icon {
  position: relative;
  top: 0;
  left: calc(50% - 26px);
  padding: 0;
  width: 52px;
  height: 52px;
  margin-top: 18px;
  margin-bottom: 24px;
}

.title {
  position: relative;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin: 10px auto;
}

.cancel-btn {
  margin-right: 20px;
}

.tips {
  display: block;
  position: relative;
  margin-top: 10px;
  font-size: 12px;
  color: gray;
  text-align: center;
}

.warning {
  display: block;
  position: relative;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: red;
}

// .admin {
//   margin-top: 10px;
//   text-align: center;
//   color: red;
//   font-size: 12px;
// }

// .cancel-btn {
//   background: rgba(255, 255, 255, 1);
//   border: 1px solid rgba(74, 74, 74, 1);
//   color: rgba(74, 74, 74, 1);
// }

// .cancel-btn:hover {
//   background: rgba(0, 69, 156, 1);
//   color: rgba(255, 255, 255, 1);
//   border: 0;
// }

// .disabled-cancel-btn {
//   background: rgba(255, 255, 255, 1);
//   border: 1px solid rgba(155, 155, 155, 1);
//   color: rgba(155, 155, 155, 1);
// }

// .ok-btn {
//   background: rgba(24, 115, 220, 1);
//   color: rgba(255, 255, 255, 1);
// }

// .ok-btn:hover {
//   background: rgba(0, 69, 156, 1);
//   color: rgba(255, 255, 255, 1);
// }

// .disabled-ok-btn {
//   background: rgba(155, 155, 155, 1);
//   color: rgba(255, 255, 255, 1);
// }

// .disabled-ok-btn:hover {
//   background: rgba(155, 155, 155, 1);
//   color: rgba(255, 255, 255, 1);
// }
</style>
