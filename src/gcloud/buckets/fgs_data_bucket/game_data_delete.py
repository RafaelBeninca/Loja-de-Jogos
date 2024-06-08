from google.cloud import storage
    
def delete_storage_folder(bucket_name, folder):
    """
    This function deletes from GCP Storage

    :param bucket_name: The bucket name in which the file is to be placed
    :param folder: Folder name to be deleted
    :return: returns nothing
    """
    cloud_storage_client = storage.Client()
    bucket = cloud_storage_client.bucket(bucket_name)

    try:
        blobs = list(bucket.list_blobs(prefix=folder))
        print(blobs)
        bucket.delete_blobs(blobs=blobs)
    except Exception as e:
        print(str(e.message))


def delete_blob(bucket_name, blob_name):
    """Deletes a blob from the bucket."""
    # bucket_name = "your-bucket-name"
    # blob_name = "your-object-name"

    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    generation_match_precondition = None

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to delete is aborted if the object's
    # generation number does not match your precondition.
    blob.reload()  # Fetch blob metadata to use in generation_match_precondition.
    generation_match_precondition = blob.generation

    blob.delete(if_generation_match=generation_match_precondition)

    print(f"Blob {blob_name} deleted.")

