import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button, Grid, Box, Typography, TextField } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getSignedUrl,
  PostArticle,
  postImage,
} from "../../services/articleService";
import { toast } from "react-toastify";
import "./quillEditor.css";

interface IFormData {
  title_0: string;
  description_0: string;
  tags: string;
  title: string;
  description: string;
  image: File | null;
  im_title: string;
  im_description: string;
  con2_title: string;
  con2_description: string;
  img2_title: string;
  img2_description: string;
  last_title: string;
  last_description: string;
}

const AddArticleForm: React.FC<any> = ({
  setShowForm,
}: {
  setShowForm: any;
}) => {
  const [formData, setFormData] = useState<IFormData>({
    title_0: "",
    description_0: "",
    tags: "",
    title: "",
    description: "",
    image: null,
    im_title: "",
    im_description: "",
    con2_title: "",
    con2_description: "",
    img2_title: "",
    img2_description: "",
    last_title: "",
    last_description: "",
  });

  const [urlData1, setUrlData1] = useState<any>();
  const [urlData2, setUrlData2] = useState<any>();

  const handleQuillChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
      const payload = { type: "png" };
      getSignedUrl(payload)
        .then(async (response) => {
          if (e.target.files) {
            const file = e.target.files[0];
            const formData = new FormData();
            Object.keys((response as any).fields).forEach((key) => {
              if (key == "x-amz-security-token") {
                formData.append(
                  "x-amz-security-token",
                  (response as any).fields[key]
                );
              } else {
                formData.append(key, (response as any).fields[key]);
              }
            });
            setUrlData1((response as any).cloudfront_url);

            formData.append("file", file);
            await postImage((response as any).url, formData);
          }
        })
        .catch((error) => {
          console.log("Upload Error:", error);
        });
    }
  };

  const handleFileChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
      const payload = { type: "png" };
      getSignedUrl(payload)
        .then(async (response) => {
          if (e.target.files) {
            const file = e.target.files[0];
            const formData = new FormData();
            Object.keys((response as any).fields).forEach((key) => {
              if (key == "x-amz-security-token") {
                formData.append(
                  "x-amz-security-token",
                  (response as any).fields[key]
                );
              } else {
                formData.append(key, (response as any).fields[key]);
              }
            });

            setUrlData2((response as any).cloudfront_url);
            formData.append("file", file);
            await postImage((response as any).url, formData);
          }
        })
        .catch((error) => {
          console.log("Upload Error:", error);
        });
    }
  };

  const generateMarkup = () => {
    return `
      <div class="rendered-content">
        <div class="big-container">
          <div class="display-ui">
            <div class="card">
              <div class="box1">
                <div class="growth">growth</div>
                <div class="quill-title">${formData.title}</div>
                <div class="quill-description">${formData.description}</div>
                <p class="para1">7 min read &emsp; January 5, 2025</p>
              </div>
              <div class="box2">
                <p class="written">WRITTEN BY</p>
                <p class="written">Business analyst, CEO of Whatever you want, speaker and writer</p>
              </div>
            </div>
          </div>

          <div class="container1">
            <div class="quill-title">${formData.title}</div>
            <div class="quill-description">${formData.description}</div>
          </div>

          <div id="ctr2">
            <span class="container2">
              <img src=${
                urlData1 ||
                "https://raw.githubusercontent.com/xfiveco/mock-api-images/main/images/img-01-xl.jpg"
              } alt="image" class="pic">
            </span>
            <span class="container3">
              <div class="quill-title">${formData.im_title}</div>
              <div class="quill-description">${formData.im_description}</div>
            </span>
          </div>

          <div class="mid_section">
            <div class="quill-title">${formData.con2_title}</div>
            <div class="quill-description">${formData.con2_description}</div>
          </div>

          <div id="ctr2-second">
            <span class="container4">
              <div class="quill-title">${formData.img2_title}</div>
              <div class="quill-description">${formData.img2_description}</div>
            </span>
            <span class="container2-second">
              <img src=${
                urlData2 ||
                "https://raw.githubusercontent.com/xfiveco/mock-api-images/main/images/img-01-xl.jpg"
              } alt="image" class="pic">
            </span>
          </div>

          <div class="end_section">
            <div class="quill-title">${formData.last_title}</div>
            <div class="quill-description">${formData.last_description}</div>
          </div>
        </div>
      </div>
    `;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const markup = generateMarkup();
    const payload = {
      markup: markup,
      title: formData.title_0,
      description: formData.description_0,
      tags: formData.tags,
      article_img: urlData1,
    };
    const loadingToast = toast.loading("Saving Article.......");
    try {
      const response = await PostArticle(payload);
      setShowForm(false);
      if (response) {
        toast.success("Blog added successfully!");
        toast.dismiss(loadingToast);
      } else {
        console.log("Error adding article");
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      toast.error("Some Error during save....... ");
      toast.dismiss(loadingToast);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "20px",
        overflow: "scroll",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 3,
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          Add New Article
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Article Title"
                value={formData.title_0}
                onChange={(e) => handleQuillChange("title_0", e.target.value)}
                placeholder="Article Title"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Article Description"
                value={formData.description_0}
                onChange={(e) =>
                  handleQuillChange("description_0", e.target.value)
                }
                placeholder="Article Description"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags"
                value={formData.tags}
                onChange={(e) => handleQuillChange("tags", e.target.value)}
                placeholder="Tags"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Left Section Title"
                value={formData.title}
                onChange={(e) => handleQuillChange("title", e.target.value)}
                placeholder="First Left Section Title"
              />
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                value={formData.description}
                onChange={(value) => handleQuillChange("description", value)}
                placeholder="First Left Section Description"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Left Section with Image Title"
                value={formData.im_title}
                onChange={(e) => handleQuillChange("im_title", e.target.value)}
                placeholder="First Left Section with Image Title"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Left Section with Image Description"
                value={formData.im_description}
                onChange={(e) =>
                  handleQuillChange("im_description", e.target.value)
                }
                placeholder="First Left Section with Image Description"
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" name="image" onChange={handleFileChange1} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Second Left Section Title"
                value={formData.con2_title}
                onChange={(e) =>
                  handleQuillChange("con2_title", e.target.value)
                }
                placeholder="Second Left Section Title"
              />
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                value={formData.con2_description}
                onChange={(value) =>
                  handleQuillChange("con2_description", value)
                }
                placeholder="Second Left Section Description"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Image Right Section Title"
                value={formData.img2_title}
                onChange={(e) =>
                  handleQuillChange("img2_title", e.target.value)
                }
                placeholder="First Image Right Section Title"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Image Right Section Description"
                value={formData.img2_description}
                onChange={(e) =>
                  handleQuillChange("img2_description", e.target.value)
                }
                placeholder="First Image Right Section Description"
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" name="image" onChange={handleFileChange2} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Third Left Section Title"
                value={formData.last_title}
                onChange={(e) =>
                  handleQuillChange("last_title", e.target.value)
                }
                placeholder="Third Left Section Title"
              />
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                value={formData.last_description}
                onChange={(value) =>
                  handleQuillChange("last_description", value)
                }
                placeholder="Third Left Section Description"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ background: "#800080" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddArticleForm;
