// BookingService contains operations for managing booking records via API
export class BookingService {

  // The HTTP context used to send API requests
  constructor(private context: any) {}

  // Retrieve all bookings
  async getBookings() {
    return await this.context.get('/booking');
  }

  // Retrieve a single booking by ID
  async getBooking(id: number) {
    return await this.context.get(`/booking/${id}`);
  }

  // Create a new booking with the provided payload
  async createBooking(payload: any) {
    return await this.context.post('/booking', {
      data: payload
    });
  }

  // Update an existing booking using a valid token cookie
  async updateBooking(id: number, payload: any, token: string) {
    return await this.context.put(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`
      },
      data: payload
    });
  }

  // Delete a booking using a valid token cookie
  async deleteBooking(id: number, token: string) {
    return await this.context.delete(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });
  }
}