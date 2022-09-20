<template>
  <div>
    <NavBar />

    <section class="main-content columns">
      <div class="container column is-10">
        <Nuxt />
      </div>
    </section>

    <FooterBar />
  </div>
</template>

<script>
import FooterBar from '~/components/FooterBar.vue'
import NavBar from '~/components/NavBar.vue'
export default {
  name: 'DefaultLayout',
  components: { FooterBar, NavBar }
}
</script>
