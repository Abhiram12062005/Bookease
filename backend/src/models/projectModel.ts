import mongoose, { Schema, Document, Model } from 'mongoose'
export interface IBusinessDetails {
  businessName:    string
  businessType:    string
  contactEmail:    string
  phoneNumber:     string
  businessAddress: string
  city:            string
  state:           string
  country:         string
  googleMapsLink?: string | null
}

export interface IWebsiteDetails {
  websiteDomain:  string
  businessLogo?:  string | null
  tagline?:       string | null
  primaryColor:   string
  coverImage?:    string | null
}

export interface IPaymentDetails {
  currency:           string
  paymentGateway:     string
  bankAccountDetails: string
  gstNumber?:         string | null
}

export interface IProject extends Document {
  owner:           mongoose.Types.ObjectId
  businessDetails: IBusinessDetails
  websiteDetails:  IWebsiteDetails
  paymentDetails:  IPaymentDetails
  createdAt:       Date
  updatedAt:       Date
}

const BusinessDetailsSchema = new Schema<IBusinessDetails>(
  {
    businessName: {
      type:      String,
      required:  [true, 'Business name is required'],
      trim:      true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    businessType: {
      type:     String,
      required: [true, 'Business type is required'],
      enum: {
        values:  ['Café / Restaurant', 'Corporate Events', 'Event Organizer', 'Workshops / Classes', 'Other'],
        message: '{VALUE} is not a valid business type',
      },
    },
    contactEmail: {
      type:      String,
      required:  [true, 'Contact email is required'],
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phoneNumber: {
      type:     String,
      required: [true, 'Phone number is required'],
      trim:     true,
    },
    businessAddress: {
      type:     String,
      required: [true, 'Business address is required'],
      trim:     true,
    },
    city:    { type: String, required: [true, 'City is required'],    trim: true },
    state:   { type: String, required: [true, 'State is required'],   trim: true },
    country: { type: String, required: [true, 'Country is required'], trim: true },
    googleMapsLink: { type: String, trim: true, default: null },
  },
  { _id: false }
)

const WebsiteDetailsSchema = new Schema<IWebsiteDetails>(
  {
    websiteDomain: {
      type:      String,
      required:  [true, 'Website domain is required'],
      trim:      true,
      lowercase: true,
      match:     [/^[a-z0-9-]+$/, 'Domain can only contain lowercase letters, numbers and hyphens'],
    },
    businessLogo:  { type: String, default: null },
    tagline: {
      type:      String,
      trim:      true,
      maxlength: [160, 'Tagline cannot exceed 160 characters'],
      default:   null,
    },
    primaryColor: {
      type:     String,
      required: [true, 'Primary color is required'],
      match:    [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Must be a valid hex color'],
      default:  '#9B5CF6',
    },
    coverImage: { type: String, default: null },
  },
  { _id: false }
)
const PaymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    currency: {
      type:     String,
      required: [true, 'Currency is required'],
      enum: {
        values:  ['₹ INR', '$ USD', '£ GBP', '€ EUR', 'AED', 'SGD', 'AUD'],
        message: '{VALUE} is not a supported currency',
      },
      default: '₹ INR',
    },
    paymentGateway: {
      type:     String,
      required: [true, 'Payment gateway is required'],
      enum: {
        values:  ['Razorpay', 'Stripe', 'UPI', 'Bank Account'],
        message: '{VALUE} is not a supported payment gateway',
      },
    },
    bankAccountDetails: {
      type:     String,
      required: [true, 'Bank / payout details are required'],
      trim:     true,
    },
    gstNumber: {
      type:      String,
      trim:      true,
      uppercase: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Invalid GST number format',
      ],
      default: null,
    },
  },
  { _id: false }
)
const ProjectSchema = new Schema<IProject>(
  {
    owner: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },

    businessDetails: { type: BusinessDetailsSchema, required: true },
    websiteDetails:  { type: WebsiteDetailsSchema,  required: true },
    paymentDetails:  { type: PaymentDetailsSchema,  required: true },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
)

ProjectSchema.index({ 'websiteDetails.websiteDomain': 1 }, { unique: true })

ProjectSchema.virtual('fullDomain').get(function (this: IProject) {
  return `${this.websiteDetails.websiteDomain}.bookease.in`
})

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>('Project', ProjectSchema)

export default Project