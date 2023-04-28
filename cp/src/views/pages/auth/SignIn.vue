<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const formSuccess = ref(false)
const formSubmitRedirect = () => {
  formSuccess.value = !formSuccess.value
  router.push('/thankyou')

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

          <form action="" id="login-form">
            <div class="login-form">
              <p>
                <label for="">メールアドレス</label>
                <span><input type="email" name="login-email" placeholder="abc@mail.com" required></span>
              </p>
              <p>
                <label for="">パスワード</label>
                <span><input type="password" name="password" placeholder="6文字以上" minlength="6" required></span>
              </p>
              <p class="common-btn">
                <input type="submit" value="ログイン" name="submit" class="login-btn" @click="e => formSubmitRedirect(e)">
              </p>
            </div>
          </form>
      </div>
    </div>
  </main><!-- #main -->
</template>

<style scoped>
</style>