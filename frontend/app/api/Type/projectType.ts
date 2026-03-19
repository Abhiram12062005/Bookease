// ══════════════════════════════════════════════════════════════════════════════
// Enums
// ══════════════════════════════════════════════════════════════════════════════

export type BusinessType =
  | 'Café / Restaurant'
  | 'Corporate Events'
  | 'Event Organizer'
  | 'Workshops / Classes'
  | 'Other'

export type Currency       = '₹ INR' | '$ USD' | '£ GBP' | '€ EUR' | 'AED' | 'SGD' | 'AUD'
export type PaymentGateway = 'Razorpay' | 'Stripe' | 'UPI' | 'Bank Account'
export type ApiStatus      = 'idle' | 'loading' | 'succeeded' | 'failed'

// ══════════════════════════════════════════════════════════════════════════════
// Section shapes (stored as JSON inside the Project document)
// ══════════════════════════════════════════════════════════════════════════════

export interface BusinessDetails {
  businessName:    string
  businessType:    BusinessType
  contactEmail:    string
  phoneNumber:     string
  businessAddress: string
  city:            string
  state:           string
  country:         string
  googleMapsLink?: string | null
}

export interface WebsiteDetails {
  websiteDomain:  string
  businessLogo?:  string | null
  tagline?:       string | null
  primaryColor:   string
  coverImage?:    string | null
}

export interface PaymentDetails {
  currency:           Currency
  paymentGateway:     PaymentGateway
  bankAccountDetails: string
  gstNumber?:         string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// Full Project payload  →  POST /api/projects
// ══════════════════════════════════════════════════════════════════════════════

export interface CreateProjectPayload {
  businessDetails: BusinessDetails
  websiteDetails:  WebsiteDetails
  paymentDetails:  PaymentDetails
}

export interface UpdateProjectPayload {
  businessDetails?: Partial<BusinessDetails>
  websiteDetails?:  Partial<WebsiteDetails>
  paymentDetails?:  Partial<PaymentDetails>
}

// ══════════════════════════════════════════════════════════════════════════════
// Server response
// ══════════════════════════════════════════════════════════════════════════════

export interface ProjectDocument {
  _id:             string
  owner:           string
  businessDetails: BusinessDetails
  websiteDetails:  WebsiteDetails
  paymentDetails:  PaymentDetails
  fullDomain:      string
  createdAt:       string
  updatedAt:       string
}

// ══════════════════════════════════════════════════════════════════════════════
// Redux state
// ══════════════════════════════════════════════════════════════════════════════

export interface ProjectState {
  projects:      ProjectDocument[]
  selected:      ProjectDocument | null
  fetchStatus:   ApiStatus
  createStatus:  ApiStatus
  updateStatus:  ApiStatus
  uploadStatus:  ApiStatus
  deleteStatus:  ApiStatus   // ✅ added
  error:         string | null
}

// ══════════════════════════════════════════════════════════════════════════════
// Upload response
// ══════════════════════════════════════════════════════════════════════════════

export interface UploadResponse {
  url:      string
  key:      string
  mimetype: string
  size:     number
}