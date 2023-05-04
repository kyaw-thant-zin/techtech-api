<script setup>
import { ref } from 'vue'

const loginForm = ref(null)
const formData = ref({
    email: '',
    password: ''
})

const resetForm = () => {
    formData.value.email = ''
    formData.value.password = ''
}

// sign in
const onSubmit = async () => {
    
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
                  name="email" 
                  placeholder="abc@mail.com"
                  borderless
                  lazy-rules
                  :rules="[
                    val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                  ]"
                />
              </p>
              <p>
                <label for="">パスワード</label>
                <q-input 
                  name="password" 
                  placeholder="Password"
                  borderless
                  lazy-rules
                  :rules="[
                    val => !!val.replace(/\s/g, '') || 'フィールドは必須項目です', 
                  ]"
                />
              </p>
              <p class="common-btn">
                <input type="submit" value="ログイン" name="submit" class="login-btn" @click="e => formSubmitRedirect(e)">
              </p>
            </div>
          </q-form>
      </div>
    </div>
  </main><!-- #main -->
</template>

<style scoped>
</style>