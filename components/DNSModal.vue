<!-- eslint-disable vue/no-use-computed-property-like-method -->
<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ host }}
        </p>
        <button
          type="button"
          class="delete"
          @click="$emit('close')"
        />
      </header>
      <section class="modal-card-body">
        <b-taglist>
          <b-tag
            v-for="(value, propertyName) in dns"
            :key="value"
            rounded
            :type="tagTypeDetermine(value.length)"
          >
            {{ value.length }} {{ propertyName.toLocaleUpperCase() }}
          </b-tag>
        </b-taglist>
        <template v-if="!anyRecords">
          <p>
            There are no known records assigned to this domain.
          </p>
        </template>
        <template v-else>
          <div v-for="(value, propertyName) in dns" :key="value" class="box">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong> {{ fixCapitalization(propertyName) }} Records</strong>
                    <br>
                    <ul>
                      <li v-for="record in value" :key="record">
                        <b-tag>
                          {{ record.data ?? record }}
                        </b-tag>
                      </li>
                    </ul>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </template>
      </section>
      <footer class="modal-card-foot">
        <b-button
          label="Close"
          @click="$emit('close')"
        />
      </footer>
    </div>
  </form>
</template>

<script>

export default {
  props: {
    host: {
      type: String,
      required: true
    },
    dns: {
      type: Object,
      required: true
    }
  },
  computed: {
    anyRecords () {
      return Object.values(this.dns).flat().length
    }
  },
  methods: {
    tagTypeDetermine (count) {
      switch (count) {
        case 0:
          return 'is-danger'
        case 1:
          return 'is-success'
        default:
          return 'is-warning'
      }
    },
    fixCapitalization (string) {
      if (string.length > 4) { return this.$capitalizeFirstLetter(string) } else { return string.toUpperCase() }
    }
  }
}
</script>
