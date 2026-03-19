import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: 'Validation failed',
      errors:  errors.array().map((e) => ({
        field:   e.type === 'field' ? e.path : 'unknown',
        message: e.msg,
      })),
    })
    return
  }
  next()
}

const businessDetailsRules = [
  body('businessDetails.businessName')
    .trim().notEmpty().withMessage('Business name is required')
    .isLength({ max: 100 }).withMessage('Cannot exceed 100 characters'),

  body('businessDetails.businessType')
    .notEmpty().withMessage('Business type is required')
    .isIn(['Café / Restaurant', 'Corporate Events', 'Event Organizer', 'Workshops / Classes', 'Other'])
    .withMessage('Invalid business type'),

  body('businessDetails.contactEmail')
    .trim().notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Must be a valid email address'),

  body('businessDetails.phoneNumber')
    .trim().notEmpty().withMessage('Phone number is required'),

  body('businessDetails.businessAddress')
    .trim().notEmpty().withMessage('Business address is required'),

  body('businessDetails.city')
    .trim().notEmpty().withMessage('City is required'),

  body('businessDetails.state')
    .trim().notEmpty().withMessage('State is required'),

  body('businessDetails.country')
    .trim().notEmpty().withMessage('Country is required'),

  // ✅ FIXED: checkFalsy skips validation when value is "" null or undefined
  body('businessDetails.googleMapsLink')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('Must be a valid URL'),
]

const websiteDetailsRules = [
  body('websiteDetails.websiteDomain')
    .trim().notEmpty().withMessage('Website domain is required')
    .toLowerCase()
    .matches(/^[a-z0-9-]+$/).withMessage('Domain can only contain lowercase letters, numbers and hyphens'),

  body('websiteDetails.primaryColor')
    .notEmpty().withMessage('Primary color is required')
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).withMessage('Must be a valid hex color'),

  body('websiteDetails.tagline')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 160 }).withMessage('Tagline cannot exceed 160 characters'),
]

const paymentDetailsRules = [
  body('paymentDetails.currency')
    .notEmpty().withMessage('Currency is required')
    .isIn(['₹ INR', '$ USD', '£ GBP', '€ EUR', 'AED', 'SGD', 'AUD'])
    .withMessage('Unsupported currency'),

  body('paymentDetails.paymentGateway')
    .notEmpty().withMessage('Payment gateway is required')
    .isIn(['Razorpay', 'Stripe', 'UPI', 'Bank Account'])
    .withMessage('Unsupported payment gateway'),

  body('paymentDetails.bankAccountDetails')
    .trim().notEmpty().withMessage('Bank / payout details are required'),

  // ✅ FIXED: empty string "" was hitting the GST regex and failing
  body('paymentDetails.gstNumber')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid GST number format'),
]

export const validateCreateProject = [
  ...businessDetailsRules,
  ...websiteDetailsRules,
  ...paymentDetailsRules,
  validate,
]

export const validateUpdateProject = [
  ...businessDetailsRules.map((r) => r.optional()),
  ...websiteDetailsRules.map((r)  => r.optional()),
  ...paymentDetailsRules.map((r)  => r.optional()),
  validate,
]