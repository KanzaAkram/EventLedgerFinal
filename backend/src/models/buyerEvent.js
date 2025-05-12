// models/buyerEvent.js
// const mongoose = require("mongoose");

// const ticketSchema = new mongoose.Schema({
//   // We only store price here as per the frontend state.
//   // If you had 'name' on the frontend ticket object, add it here too.
//   price: {
//     type: Number,
//     required: [true, "Ticket price is required"],
//     min: [0, "Price cannot be negative"],
//   },
//   // You might want to add ticket type name, quantity, etc. later
//   // name: { type: String, required: true },
//   // quantity: { type: Number, required: true },
// });

// const eventSchema = new mongoose.Schema(
//   {
//     host: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Host", // Reference to the Host model
//     },
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host", // Assumes a Host model for hosts
      required: [true, "Host ID is required"],
      validate: {
        validator: async function (value) {
          const host = await mongoose.model("Host").findById(value);
          return !!host;
        },
        message: "Invalid host ID",
      },
    },
    eventTitle: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: [
        "Music & Concerts",
        "Sports",
        "Theater & Performing Arts",
        "Festivals & Fairs",
        "Conferences & Workshops",
        "Family & Kids",
        "Food & Drink",
        "Art & Culture",
        "Nightlife & Parties",
        "Charity & Community",
        "Hobbies & Special Interests",
        "Technology", // Added based on image
      ],
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: ["onsite", "virtual", "hybrid"], // Match frontend options
    },

    location: {
      // Optional if event is purely virtual? Add validation if needed.
      type: String,
      trim: true,
      // Consider making this required based on eventType if needed
      required: function () {
        return this.eventType === "onsite" || this.eventType === "hybrid";
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    startTime: {
      type: String, // Store as string HH:MM
      required: [true, "Start time is required"],
      match: [/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"],
    },
    endTime: {
      type: String, // Store as string HH:MM
      required: [true, "End time is required"],
      match: [/^\d{2}:\d{2}$/, "End time must be in HH:MM format"],
    },
    endDate: {
      type: Date,
      required: [true, "Event end date is required"],
      validate: {
        validator: function (value) {
          return this.startDate <= value;
        },
        message: "End date must be after start date",
      },
    },
    ticketPriceETH: {
      type: Number,
      required: [true, "Ticket price in ETH is required"],
      min: [0, "Ticket price cannot be negative"],
    },

    images: [
      {
        url: { type: String, required: true }, // URL from Cloudinary
        public_id: { type: String, required: true }, // Public ID from Cloudinary (for deletion/updates)
      },
    ],
    ticketSupply: {
      type: Number,
      required: [true, "Ticket supply is required"],
      min: [1, "Ticket supply must be at least 1"],
    },
    ticketsSold: {
      type: Number,
      default: 0,
      min: [0, "Tickets sold cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.ticketSupply;
        },
        message: "Tickets sold cannot exceed ticket supply",
      },
    },
    isResellEnabled: {
      type: Boolean,
      default: true,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

eventSchema.index({ host: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ eventCategory: 1 });


const Event = mongoose.model("Event", eventSchema);

module.exports = Event;