
/* global gon */
/* eslint no-console: off */
import * as $ from 'jquery'
import * as braintree from 'braintree-web'

declare const gon: any

// Taken verbatim from the bootstrap example at
// https://developers.braintreepayments.com/guides/hosted-fields/examples/javascript/v3

// console.log("Hosted Fields")
$(document).ready(() => {
  console.log("Hello from braintree")

  let form: HTMLFormElement | null = document.querySelector('#cardForm')
  if (form && gon.brain_tree_client_token) {
    // console.log("card form")

    braintree.client.create({
      authorization: gon.brain_tree_client_token
    }, (clientError, clientInstance) => {
      if (clientError) {
        console.error(clientError)
        return
      }

      // Inside of your client create callback...
      braintree.dataCollector.create({
        client: clientInstance,
        kount: true,
        paypal: false
      }, (dataError, dataCollectorInstance) => {
        if (dataError) {
          // Handle error in data collector creation
          console.error(dataError)
          return
        }
        form = document.getElementById('cardForm') as HTMLFormElement
        let deviceDataInput = form.device_data
        if (deviceDataInput === null) {
          deviceDataInput = document.createElement('input')
          deviceDataInput.name = 'device_data'
          deviceDataInput.type = 'hidden'
          form.appendChild(deviceDataInput)
        }
        deviceDataInput.value = dataCollectorInstance.deviceData
      })

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          input: {
            'font-size': '14px',
            'font-family': 'helvetica, tahoma, calibri, sans-serif',
            color: '#3a3a3a'
          },
          ':focus': { color: 'black' }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationMonth: {
            selector: '#expiration-month',
            placeholder: 'MM'
          },
          expirationYear: {
            selector: '#expiration-year',
            placeholder: 'YY'
          },
          postalCode: {
            selector: '#postal-code',
            placeholder: '90210'
          }
        }
      }, (hostedFieldsError, hostedFieldsInstance) => {
        if (hostedFieldsError) {
          console.error(hostedFieldsError)
          return
        }
        hostedFieldsInstance.on('validityChange', (event: braintree.HostedFieldsStateObject) => {
          const field = (event.fields as any)[event.emittedBy]
          if (field.isValid) {
            if ((event.emittedBy === 'expirationMonth') || (event.emittedBy === 'expirationYear')) {
              if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
                return
              }
            } else if (event.emittedBy === 'number') {
              $('#card-number').next('span').text('')
            }
            // Apply styling for a valid field
            $(field.container).parents('.form-group').addClass('has-success')
          } else if (field.isPotentiallyValid) {
            // Remove styling  from potentially valid fields
            $(field.container).parents('.form-group').removeClass('has-warning')
            $(field.container).parents('.form-group').removeClass('has-success')
            if (event.emittedBy === 'number') {
              $('#card-number').next('span').text('')
            }
          } else {
            // Add styling to invalid fields
            $(field.container).parents('.form-group').addClass('has-warning')
            // Add helper text for an invalid card number
            if (event.emittedBy === 'number') {
              $('#card-number').next('span').text('Looks like this card number has an error.')
            }
          }
        })
        hostedFieldsInstance.on('cardTypeChange', (event: braintree.HostedFieldsStateObject) => {
          // Handle a field's change, such as a change in validity or credit card type
          if (event.cards.length === 1) {
            $('#card-type').text(event.cards[0].niceType)
          } else {
            $('#card-type').text('Card')
          }
        })

        $('#cardForm').submit((event) => {
          // console.log 'interupt submit'
          // console.log $('input[name=plan_radio]:checked').val()

          event.preventDefault()
          hostedFieldsInstance.tokenize((tokenizeError: braintree.BraintreeError, payload: braintree.HostedFieldsTokenizePayload) => {
            if (tokenizeError) {
              console.error(tokenizeError)
              return
            }
            // This is where you would submit payload.nonce to your server
            // alert 'Submit your nonce to your server here!'
            let nonceElement: HTMLInputElement | null = document.querySelector('input[name="payment_method_nonce"]')
            if(nonceElement && form) {
              nonceElement.value = payload.nonce
              // console.log $('input[name=plan_radio]:checked').val()
              form.submit()
            }
            else {
              throw new Error('Braintree failed to create nonce.')
            }
          })
        })
      })
    })
  }
})

// A slightly simpler though more readable version that is shown at
// https://developers.braintreepayments.com/guides/hosted-fields/overview/javascript/v3
// createHostedFields = (clientInstance) ->
//   braintree.hostedFields.create {
//     client: clientInstance
//     styles:
//       'input':
//         'font-size': '16px'
//         'font-family': 'courier, monospace'
//         'font-weight': 'lighter'
//         'color': '#ccc'
//       ':focus': 'color': 'black'
//       '.valid': 'color': '#8bdda8'
//     fields:
//       number:
//         selector: '#card-number'
//         placeholder: '4111 1111 1111 1111'
//       cvv:
//         selector: '#cvv'
//         placeholder: '123'
//       expirationDate:
//         selector: '#expiration-date'
//         placeholder: 'MM/YYYY'
//       postalCode:
//         selector: '#postal-code'
//         placeholder: '11111'
//   }, (err, hostedFieldsInstance) ->

//     teardown = (event) ->
//       event.preventDefault()
//       alert 'Submit your nonce to your server here!'
//       hostedFieldsInstance.teardown ->
//         createHostedFields clientInstance
//         form.removeEventListener 'submit', teardown, false
//         return
//       return

//     form.addEventListener 'submit', teardown, false
//     return
//   return

// authorization = 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
// braintree.client.create { authorization: authorization }, (err, clientInstance) ->
//   if err
//     console.error err
//     return
//   createHostedFields clientInstance
//   return
// )
