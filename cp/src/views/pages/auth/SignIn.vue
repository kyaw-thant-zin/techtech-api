<script setup>
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue' 
import { useAuthStore } from '@/stores/Auth'

const $q = useQuasar()
const authStore = useAuthStore()

const loginForm = ref(null)
const formData = ref({
    email: '',
    password: ''
})

// watch the loading
watchEffect(() => {
    // set area rows
    if(authStore._loading) {
        $q.loading.show()
    } else {
        $q.loading.hide()
    }

}, [authStore._loading])

const resetForm = () => {
  formData.value.email = ''
  formData.value.password = ''
}

// sign in
const onSubmit = async () => {
  await authStore.handleSignIn(formData.value)
  if(authStore._success) {
    authStore.storeSuccess(false)
    resetForm()
    authStore.router.replace({ name: 'cp.dashboard' })
  }

  if(authStore._error) {
    $q.notify({
      caption: '無効なメールアドレスまたはパスワード。',
      message: 'エラー！',
      type: 'negative',
      timeout: 1000
    })
    authStore.storeError(false)
  }
}

</script>

<template>
  <main id="main" class="site-main sl fit">
    <div id="mv" class="sl-mv">
      <div class="sl-mv-inn inner">
        <div class="sl-mv-inn-ttl">
          <h1>ログイン</h1>
        </div>
      </div>
    </div>
    <div id="login" class="sl-login">
      <div class="sl-login-inn inner subpage">
          <q-form ref="loginForm" @submit="onSubmit">
            <div class="login-form">
              <p>
                <label for="">メールアドレス</label>
                <q-input 
                  type="email"
                  name="email" 
                  placeholder="abc@mail.com"
                  v-model="formData.email"
                  borderless
                  lazy-rules
                  :rules="[
                    val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                    val => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) || 'メール形式が無効です'
                  ]"
                />
              </p>
              <p>
                <label for="">パスワード</label>
                <q-input 
                  type="password"
                  name="password" 
                  placeholder="Password"
                  v-model="formData.password"
                  borderless
                  lazy-rules
                  :rules="[
                    val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                    val => val.length >= 8 || 'パスワードは 8 文字以上にする必要があります'
                  ]"
                />
              </p>
              <p class="common-btn">
                <input type="submit" value="ログイン" name="submit" class="login-btn">
              </p>
            </div>
          </q-form>
      </div>
    </div>
  </main><!-- #main -->
</template>

<style scoped>
</style>