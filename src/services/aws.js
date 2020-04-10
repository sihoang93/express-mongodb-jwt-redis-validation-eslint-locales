/* eslint-disable no-undef */
import aws from 'aws-sdk';
const { AWS_ACCESS_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET, AWS_REGION } = process.env;

aws.config.update({
  accessKeyId: AWS_ACCESS_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});
const s3 = new aws.S3();

export const uploadToS3 = async (fileName, bufferFile) => {
  try {
    await s3
      .putObject({
        Bucket: AWS_BUCKET,
        Key: `sihoang.io/images/${fileName}`,
        ContentType: 'image/png',
        Body: new Buffer.from(bufferFile, 'base64'),
      })
      .promise();
  } catch (err) {
    console.log('----- Upload file lỗi...', err);
  }
};
