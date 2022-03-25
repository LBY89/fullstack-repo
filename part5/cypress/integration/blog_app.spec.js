describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Superuser',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function() {
    cy.contains('login')
    cy.contains('Login to See My Secrets')
  })
  it('login form is shown', function() {
    cy.contains('login')
  })
  describe('login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('root')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Superuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('hhaha')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
    })

    it('fails with red notice', function() {
      cy.contains('login').click()
      cy.get('#username').type('hhaha')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })

  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'salainen' })
    })

    it('A blog can be created and added to the blog list', function() {
      cy.contains('create blog').click()
      cy.get('#title').type('cypress rocks')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.fi')
      cy.get('#create-button').click()
      cy.contains('a new blog cypress rocks by cypress added')
      cy.contains('cypress rocks cypress')
    })

    describe('new blog exists', function() {
      beforeEach(function () {
        cy.createBlog({
          title: 'Does cypress rock',
          author: 'cypress',
          url: 'www.wwww'
        })
      })

      it('and it can be liked', function() {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
        cy.contains('1')
      })
      it('and it can be deleted by logged in dude', function() {
        cy.get('#view-button').click()
        cy.get('#remove-button').click()
        cy.contains('Does cypress rock cypress').should('not.exist')
      })
      describe('not any dude can create a blog', function () {
        beforeEach(function() {
          cy.request('POST', 'http://localhost:3003/api/testing/reset')
          const user = {
            name: 'radomdude',
            username: 'lby',
            password: 'mima'
          }
          cy.request('POST', 'http://localhost:3003/api/users/', user)
          cy.visit('http://localhost:3000')
        })

        it('and it cannot be deleted any other dude', function() {
          cy.get('#logout-button').click()
          cy.login({ username: 'lby', password: 'mima' })
          cy.get('#view-button').should('not.exist')
          
        })
      })

    })



  })
  describe('ranking blogs according to likes', function() {

    beforeEach(function () {
      cy.login({ username: 'root', password: 'salainen' })
      cy.createBlog({
        title: 'Does cypress rock',
        author: 'cypress',
        url: 'www.wwww',
        likes: 199
      })
      cy.createBlog({
        title: 'cypress getting difficult',
        author: 'cypress',
        url: 'www',
        likes: 1299,
      })

      cy.createBlog({
        title: 'hope this could work',
        author: 'cypress',
        url: 'www.wwww',
        likes: 9
      })

    })
    it('lets check ranking result', function () {
      cy.get('.blog-container').eq(0).should('contain', 'cypress getting difficult cypress')
      cy.get('.blog-container').eq(1).should('contain', 'Does cypress rock cypress')
      cy.get('.blog-container').eq(2).should('contain', 'hope this could work cypress')
    })

  })

})