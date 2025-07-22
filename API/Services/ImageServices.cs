using System;
using API.RequestHelper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class ImageServices
{
    private readonly Cloudinary _cloudinary;

    public ImageServices(IOptions<CloudinarySettings> options)
    {
        var account = new Account
        (
           options.Value.CloudName,
           options.Value.ApiKey,
           options.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
    {
        var uploadresult = new ImageUploadResult();

        if (file.Length > 0)
        {
            using var stream = file.OpenReadStream();
            var uploadPrams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "rs-course"
            };
            uploadresult = await _cloudinary.UploadAsync(uploadPrams);
        }
        return uploadresult;
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deletePramas = new DeletionParams(publicId);

        var result = await _cloudinary.DestroyAsync(deletePramas);

        return result;

    }
}
