<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
        >
          debugmc.info
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>

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
export default {
  name: 'DefaultLayout',
  components: { FooterBar }
}
</script>
