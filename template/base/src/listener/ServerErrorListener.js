import {
  ErrorListener, ErrorsHandler
} from 'quick-d/lib/common/Handler'
import ValueNotDeliveredError from 'quick-d/lib/error/ValueNotDeliveredError'

/**
 * Multi-case mode, each exception handling is independent
 */
class ServerErrorListener extends ErrorListener {
  // Whether to print the stack information, it is not printed by default
  // The object must have a method to add the ErrorsHandler decorator
  isLogStack = process.env.NODE_ENV === 'development'

  @ErrorsHandler([ Error ], 1)
  dealError ([ ctx, error ]) {
    console.log('dealError', error)
  }

  @ErrorsHandler([ ValueNotDeliveredError ], 10)
  dealValueNotDeliveredError ([ ctx, error ]) {
    console.log('dealValueNotDeliveredError', error)
  }
}
