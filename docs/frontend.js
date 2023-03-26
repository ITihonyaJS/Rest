import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.8/dist/vue.esm.browser.js'

Vue.component('Loader', {
  template: `
    <div style="display: flex; justify-content: center; align-items: center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `
})

new Vue({
  el: '#app',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        value: ''
      },
      contacts: []
    }
  },
  computed: {
    canCreated() {
      return this.form.name.trim() && this.form.value.trim()
    }
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form
      const newContact = await request('/api/contacts', 'POST', contact)

      this.contacts.push(newContact)
      this.form.name = this.form.value = ''
    },
    async markContact(id) {
      const contact = this.contacts.find((el) => {
        return el.id === id
      })
      const markContact = await request(`/api/contacts/${id}`, 'PUT', { ...contact, marked: true })

      contact.marked = markContact.marked
    },
    async removeContact(id) {
      const response = await request(`/api/contacts/${id}`, 'DELETE')
      this.contacts = this.contacts.filter((el) => {
        return el.id !== id
      })
    }
  },
  async mounted() {
    //так как мы работаем на порте 3000 то нам необязательно указывать полный url...достаточно указать "/".Название contacts в url это произвольное название
    this.loading = true
    this.contacts = await request('/api/contacts')
    this.loading = false
  }
})

async function request(url, method = 'GET', data = null) {
  try {
    const headers = {}
    let body
    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }
    //c помощью await пожду пока промис fetch закончится
    const response = await fetch(url, {
      method,
      headers,
      body
    })
    return await response.json()
  } catch (e) {
    console.warn('Error', e.message)
  }
}
