import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { GetServerSideProps } from "next";
import { AdminLayout } from "../../../components/layouts";
import { IProduct } from "../../../interfaces";
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import { dbProducts } from "../../../database";
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { tesloApi } from "../../../api";
import { Product } from "../../../models";
import { useRouter } from "next/router";

const validTypes = ["shirts", "pants", "hoodies", "hats"];
const validGender = ["men", "women", "kid", "unisex"];
const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface FormData
  extends Omit<
    IProduct,
    "createdAt" | "updatedAt" | "_id" | "type" | "gender" | "sizes"
  > {
  _id?: string;
  type: string;
  gender: string;
  sizes: string[];
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const [newTagValue, setNewTagValue] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        const newSlug =
          value.title
            ?.trim()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
            .toLowerCase() || "";
        setValue("slug", newSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onNewTag = () => {
    const tag = newTagValue.trim();

    setNewTagValue("");

    const currentTags = new Set(getValues("tags"));

    currentTags.add(tag);

    setValue("tags", Array.from(currentTags), {
      shouldValidate: true,
    });
  };

  const onDeleteTag = (tag: string) => {
    const currentTags = getValues("tags").filter((t) => tag !== t);

    setValue("tags", currentTags, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    if (formData.images.length < 2)
      return alert("Debes subir al menos 2 imágenes");
    setIsSaving(true);

    try {
      const { data } = await tesloApi({
        url: "/admin/products",
        method: formData._id ? "PUT" : "POST",
        data: formData,
      });

      if (!formData._id) {
        // recargar el navegador
        console.log({
          result: data,
        });
        router.replace(`/admin/products/${data.slug}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const onDeleteImage = async (image: string) => {
    const currentImages = getValues("images");

    setValue(
      "images",
      currentImages.filter((currentImage) => currentImage !== image),
      {
        shouldValidate: true,
      }
    );
  };

  const onFilesSelected = ({ target }: ChangeEvent) => {
    setIsSaving(true);
    const files = (target as HTMLInputElement).files;

    if (!files || !files.length) return;

    try {
      Array.from(files).forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await tesloApi.post<{ message: string }>(
          "/admin/uploads",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const currentImages = getValues("images");

        setValue("images", [...currentImages, data.message], {
          shouldValidate: true,
        });
        setIsSaving(false);
      });
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  const onChangeSize = (size: string) => {
    const currentSizes = getValues("sizes");

    if (currentSizes.includes(size)) {
      setValue(
        "sizes",
        currentSizes.filter((currentSize) => currentSize !== size),
        {
          shouldValidate: true,
        }
      );
      return;
    }

    setValue("sizes", [...currentSizes, size], {
      shouldValidate: true,
    });
  };

  return (
    <>
      <Box
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgcolor='rgba(0,0,0,0.5)'
        zIndex={9999}
        justifyContent='center'
        alignItems='center'
        display={isLoading ? "flex" : "none"}
      >
        <CircularProgress color='info' />
      </Box>
      <AdminLayout
        title={"Producto"}
        subTitle={`Editando: ${product.title}`}
        icon={<DriveFileRenameOutline />}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
            <Button
              color='secondary'
              startIcon={<SaveOutlined />}
              sx={{ width: "150px" }}
              type='submit'
              disabled={isSaving}
            >
              Guardar
            </Button>
          </Box>

          <Grid container spacing={2}>
            {/* Data */}
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={isSaving}
                label='Título'
                variant='filled'
                fullWidth
                sx={{ mb: 1 }}
                {...register("title", {
                  required: "Este campo es requerido",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />

              <TextField
                disabled={isSaving}
                label='Descripción'
                variant='filled'
                fullWidth
                multiline
                sx={{ mb: 1 }}
                {...register("description", {
                  required: "Este campo es requerido",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <TextField
                disabled={isSaving}
                label='Inventario'
                type='number'
                variant='filled'
                fullWidth
                sx={{ mb: 1 }}
                {...register("inStock", {
                  required: "Este campo es requerido",
                  min: { value: 0, message: "El valor mínimo es 0" },
                })}
                error={!!errors.inStock}
                helperText={errors.inStock?.message}
              />

              <TextField
                disabled={isSaving}
                label='Precio'
                type='number'
                variant='filled'
                fullWidth
                sx={{ mb: 1 }}
                {...register("price", {
                  required: "Este campo es requerido",
                  min: { value: 0, message: "El valor mínimo es 0" },
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />

              <Divider sx={{ my: 1 }} />

              <FormControl disabled={isSaving} sx={{ mb: 1 }}>
                <FormLabel>Tipo</FormLabel>
                <RadioGroup
                  row
                  value={getValues("type")}
                  onChange={({ target }) =>
                    setValue("type", target.value, { shouldValidate: true })
                  }
                >
                  {validTypes.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color='secondary' />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl disabled={isSaving} sx={{ mb: 1 }}>
                <FormLabel>Género</FormLabel>
                <RadioGroup
                  row
                  value={getValues("gender")}
                  onChange={({ target }) =>
                    setValue("gender", target.value, { shouldValidate: true })
                  }
                >
                  {validGender.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color='secondary' />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormGroup>
                <FormLabel>Tallas</FormLabel>
                {validSizes.map((size) => (
                  <FormControlLabel
                    disabled={isSaving}
                    key={size}
                    control={
                      <Checkbox checked={getValues("sizes").includes(size)} />
                    }
                    label={size}
                    onChange={() => onChangeSize(size)}
                  />
                ))}
              </FormGroup>
            </Grid>

            {/* Tags e imagenes */}
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={isSaving}
                label='Slug - URL'
                variant='filled'
                fullWidth
                sx={{ mb: 1 }}
                {...register("slug", {
                  required: "Este campo es requerido",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  validate: (val) =>
                    val.trim().includes(" ")
                      ? "No puede tener espacio en blanco"
                      : undefined,
                })}
                error={!!errors.slug}
                helperText={errors.slug?.message}
              />

              <TextField
                disabled={isSaving}
                label='Etiquetas'
                variant='filled'
                fullWidth
                sx={{ mb: 1 }}
                helperText='Presiona [spacebar] para agregar'
                value={newTagValue}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onNewTag();
                  }
                }}
                onChange={({ target }) => setNewTagValue(target.value)}
                onKeyUp={({ code }) => {
                  // Press spacebar
                  if (code === "Space") {
                    onNewTag();
                  }
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  listStyle: "none",
                  p: 0,
                  m: 0,
                }}
                component='ul'
              >
                {getValues("tags").map((tag) => {
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => onDeleteTag(tag)}
                      color='primary'
                      size='small'
                      sx={{ ml: 1, mt: 1 }}
                      disabled={isSaving}
                    />
                  );
                })}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display='flex' flexDirection='column'>
                <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                <Button
                  color='secondary'
                  fullWidth
                  startIcon={<UploadOutlined />}
                  sx={{ mb: 3 }}
                  disabled={isSaving}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Cargar imagen
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*'
                  style={{
                    display: "none",
                  }}
                  onChange={onFilesSelected}
                />

                <Chip
                  label='Es necesario al 2 imagenes'
                  color='error'
                  variant='outlined'
                  sx={{
                    mb: 3,
                    display: getValues("images").length >= 2 ? "none" : "flex",
                  }}
                />

                <Grid container spacing={2}>
                  {getValues("images").map((img) => (
                    <Grid item xs={4} sm={3} key={img}>
                      <Card>
                        <CardMedia
                          component='img'
                          className='fadeIn'
                          image={img}
                          alt={img}
                        />
                        <CardActions>
                          <Button
                            disabled={isSaving}
                            onClick={() => onDeleteImage(img)}
                            fullWidth
                            color='error'
                          >
                            Borrar
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </form>
      </AdminLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = "" } = query;

  let product: IProduct | null = null;

  if (slug === "new") {
    const tempProduct = JSON.parse(JSON.stringify(new Product()));
    delete tempProduct._id;
    tempProduct.images = ["img1.jpg", "img2.jpg", "img3.jpg"];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
