import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function testConnection() {
  // 1. Check if variables are loaded
  console.log("Checking environment variables...");
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("❌ Error: AWS credentials are missing from .env");
    return;
  }
  if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
    console.error("❌ Error: Bucket name or Region is missing from .env");
    return;
  }
  console.log("✅ Environment variables found.");

  // 2. Initialize S3 Client
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // 3. Attempt a Test Upload
  const testFileName = "connection-test.txt";
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: testFileName,
    Body: "Hello! If you are reading this, your app connected to AWS S3 successfully.",
  };

  try {
    console.log(`\nAttempting to upload '${testFileName}' to bucket '${process.env.AWS_BUCKET_NAME}'...`);
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("🎉 SUCCESS! Connection established and file uploaded.");
    console.log("👉 Go to your AWS S3 Console and look for 'connection-test.txt' to confirm.");
  } catch (err) {
    console.error("\n❌ CONNECTION FAILED:");
    console.error("---------------------");
    console.error(err.message);
    
    // Help diagnose common errors
    if (err.name === 'InvalidAccessKeyId') {
      console.log("\n💡 Hint: Your Access Key ID might be wrong or inactive.");
    } else if (err.name === 'SignatureDoesNotMatch') {
      console.log("\n💡 Hint: Your Secret Access Key is likely incorrect.");
    } else if (err.name === 'AccessDenied') {
      console.log("\n💡 Hint: Your IAM User does not have 's3:PutObject' permissions for this bucket.");
    } else if (err.code === 'ENOTFOUND') {
      console.log("\n💡 Hint: Check your internet connection or the AWS_REGION in your .env.");
    }
  }
}

testConnection();