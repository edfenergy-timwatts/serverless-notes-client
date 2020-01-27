// This module is not currently in use

import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;

// Use Storage.put() for public uploads?
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });

  return stored.key;
}
