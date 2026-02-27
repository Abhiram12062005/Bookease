import mongoose, {Document, Model, Schema} from "mongoose";

export interface User extends Document{
    name: string;
    phoneCountryCode: string;
    phoneNumber: string;      
    email: string;
    password: string;         
    organisationName: string;
    location: string;
    subscribed: boolean;
    subscriptions: ISubscription[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubscription {
  packageType:  'Starter' | 'Growth' | 'Scale';
  packagePrice: number;
  billingCycle: 'monthly' | 'Quarterly';
  durationDays: number;        
  startDate:    Date;
  endDate:      Date;         
  razorpayOrderId:   string;
  razorpayPaymentId: string;
  status: 'active' | 'expired';
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        packageType:  { 
            type: String, 
            enum: ['Starter', 'Growth', 'Scale'], 
            required: true 
        },
        packagePrice: { 
            type: Number, 
            required: true 
        },
        billingCycle: { 
            type: String, enum: ['monthly', 'Quarterly'], 
            required: true 
        },
        durationDays: { 
            type: Number, 
            required: true 
        },
        startDate: { 
            type: Date,   
            required: true 
        },
        endDate:{ 
            type: Date,   
            required: true 
        },
        razorpayOrderId:{ 
            type: String, 
            required: true 
        },
        razorpayPaymentId:{ 
            type: String, 
            default: '' 
        },
        status:{ 
            type: String, 
            enum: ['active', 'expired'], 
            default: 'active' 
        },
  },
  { _id: true },
)

const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        phoneCountryCode: {
            type: String,
            required: [true, 'Phone country code is required'],
            default: '+91',
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,   
        },
        organisationName: {
            type: String,
            required: [true, 'Organisation name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        subscribed: {
            type: Boolean,
            required: true,
            default: false
        },
        subscriptions:{ 
            type: [SubscriptionSchema], 
            default: [] 
        },
    },
    { timestamps: true },
)

const User:Model<User> = mongoose.models.User ?? mongoose.model<User> ('User', userSchema);

export default User;