module.exports = {
  'Grilla de canales: Contenedor de fechas. 8 fechas': function(browser) {
    browser
      .url('http://localhost:8080/programacion')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.menu-dates-container')
      .assert.elementCount('.date-element', 8)
      .end()
  },
  'Grilla de canales: El h1 de la grilla tenga el título correcto': function(browser) {
    browser
      .url('http://localhost:8080/programacion')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('h1.title')
      .assert.containsText('h1.title', 'Grilla')
      .end()
  }
}
