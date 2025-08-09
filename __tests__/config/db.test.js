const mongoose = require('mongoose');
const connectDB = require('../../config/db');

// Mock mongoose.connect method
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

// Mock console.log and console.error for testing output
describe('Database Connection', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.spyOn(console, 'log').mockRestore();
    jest.spyOn(console, 'error').mockRestore();
    jest.spyOn(process, 'exit').mockRestore();
  });

  test('should connect to MongoDB successfully with valid credentials', async () => {
    // Mock successful connection
    mongoose.connect.mockResolvedValue({
      connection: { host: 'test-host' },
    });

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb+srv://prajapatiarjun68663:rvSwDZeIqo4vdnMg@cluster0.r4ebzwo.mongodb.net/'
    );
    expect(console.log).toHaveBeenCalledWith('MongoDB Connected: test-host');
    expect(console.error).not.toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('should handle connection failure and exit process', async () => {
    // Mock connection failure
    const errorMessage = 'Connection failed';
    mongoose.connect.mockRejectedValue(new Error(errorMessage));

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb+srv://prajapatiarjun68663:rvSwDZeIqo4vdnMg@cluster0.r4ebzwo.mongodb.net/'
    );
    expect(console.error).toHaveBeenCalledWith('MongoDB connection error:', errorMessage);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
