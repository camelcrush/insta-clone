import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file, userId, dirName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream(); // Apollo server Upload를 통해 들어온 file로부터 createStream() 실행하여 스트림 가져오기
  const objectName = `${dirName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: `insta-camelcrush`,
      Key: objectName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};
