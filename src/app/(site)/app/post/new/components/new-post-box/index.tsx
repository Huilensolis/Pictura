"use client";

import { PlusSquare, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUserProfile } from "@/hooks/use-user-profile";
import { FormAreas } from "./new-post.models";
import { PrimaryButton } from "@/components/ui/buttons/primary";
import { useBase64Image } from "@/hooks/use-base-64-image";
import { Heading } from "@/components/ui/typography/heading";
import { ClientRouting } from "@/models/routing/client";
import { createNewPost } from "@/actions/new-post";
import { useRouter } from "next/navigation";

export function NewPostBox() {
  const [formImageSrc, setFormImageSrc] = useState<string | null>(null);
  const [formSubmitingState, setFormSubmitingState] = useState<{
    hasFormBeenSubmitted: boolean;
    hasSubmittingBeenSuccesful: boolean;
    hasSubmittingFailed: boolean;
  }>({
    hasFormBeenSubmitted: false,
    hasSubmittingFailed: false,
    hasSubmittingBeenSuccesful: false,
  });

  const [isHoveringImageArea, setHoveringImageArea] = useState(false);

  const { userProfile } = useUserProfile();

  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    watch,
    resetField,
  } = useForm<FormAreas>({ mode: "onChange" });

  const { parseImageToBase64 } = useBase64Image();

  async function publishPost(data: FormAreas) {
    if (!userProfile) return;

    const image = data.media[0];
    const title = data.title;

    if (!image || !title) return;

    try {
      const base64Image = await parseImageToBase64({ image });
      if (!base64Image) throw new Error("No base64Image");

      const { newPostId } = await createNewPost({
        image: base64Image,
        post: {
          title,
        },
      });

      setFormSubmitingState({
        hasFormBeenSubmitted: true,
        hasSubmittingFailed: false,
        hasSubmittingBeenSuccesful: true,
      });
      UnSelectImage();
      resetField("title");
      router.push(ClientRouting.post().page(newPostId));
    } catch (e) {
      setFormSubmitingState({
        hasSubmittingFailed: true,
        hasFormBeenSubmitted: true,
        hasSubmittingBeenSuccesful: false,
      });
    }
  }

  function UnSelectImage() {
    resetField("media");
    setFormImageSrc(null);
  }

  return (
    <form
      className="flex xl:flex-row flex-col gap-2 w-full"
      onSubmit={handleSubmit(publishPost)}
    >
      <section className="flex flex-col gap-4">
        <div
          className={`flex cursor-pointer ${
            formImageSrc ? "h-max" : "h-full xl:min-h-none min-h-72"
          } w-96 relative flex-col justify-center items-center bg-neutral-300 hover:bg-neutral-300 dark:bg-cm-lighter-gray dark:hover:brightness-125 dark:hover:bg-cm-lighter-gray transition-all duration-75 rounded-md overflow-hidden`}
          onMouseOver={() => formImageSrc && setHoveringImageArea(true)}
          onMouseOut={() => isHoveringImageArea && setHoveringImageArea(false)}
        >
          {formImageSrc && (
            <div className="w-full h-full relative">
              <img
                src={formImageSrc}
                className="object-cover h-full w-full"
                alt=""
              />
              <button
                className="z-20 absolute top-2 right-2 text-neutral-50 p-2 bg-neutral-700 rounded-[calc(0.5rem-0.375rem)] hover:bg-red-500 transition-colors delay-75"
                onClick={UnSelectImage}
                type="button"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          )}
          <label htmlFor="image" className="hidden">
            image
          </label>
          <input
            type="file"
            className="h-full absolute top-0 left-0 w-full opacity-0 cursor-pointer z-10"
            {...register("media", {
              validate: (files) => {
                if (!files || files.length !== 1) return;

                const file = files[0] as File;
                if (!file) return;

                const fileType = file.type.split("/")[0];
                if (fileType !== "image") {
                  return "only images in jpeg, png, jpg, webp formats are allowed";
                }

                if (file.size > 1 * 1000 * 1024) {
                  return "image size is larger than 1MB";
                }

                const render = new FileReader();
                render.readAsDataURL(file);
                render.onload = (event) => {
                  if (!event.target) return;
                  setFormImageSrc(event.target.result as string);
                };
              },
              required: { value: true, message: "Image is required" },
            })}
          />
          <div
            className={`${
              formImageSrc && !isHoveringImageArea ? "hidden" : "flex"
            } ${
              formImageSrc &&
              true &&
              "absolute flex items-center justify-center top-0 left-0 w-full h-full bg-neutral-900/40"
            }`}
          >
            <PlusSquare
              className={`pointer-events-none ${
                !formImageSrc && "text-neutral-400 dark:text-neutral-500"
              } ${
                formImageSrc && !isHoveringImageArea
                  ? "hidden"
                  : formImageSrc && isHoveringImageArea
                    ? "block text-neutral-300"
                    : ""
              }`}
            />
          </div>
        </div>
        {errors.media && (
          <span className="text-red-500">{errors.media.message}</span>
        )}
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex flex-col">
          <textarea
            placeholder="Title"
            className="bg-transparent placeholder:font-bold text-4xl w-full max-w-96 h-[340px] border border-neutral-300 dark:border-cm-lighter-gray resize-none p-2 text-neutral-800 dark:text-neutral-300 font-bold placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
            {...register("title", {
              maxLength: {
                value: 150,
                message: "Max title characteres is 150",
              },
              required: { value: true, message: "Title is required" },
            })}
          />
          {errors.title?.type === "maxLength" && (
            <span className="text-red-500">
              {watch("title").length} of 150 characteres
            </span>
          )}
          {errors.title?.type === "required" && (
            <span className="text-red-500">Title required</span>
          )}
        </div>
        <PrimaryButton
          type="submit"
          disabled={isSubmitting || !isValid}
          isLoading={isSubmitting}
        >
          Post
        </PrimaryButton>
        {formSubmitingState.hasSubmittingFailed && (
          <p className="text-red-500 w-full text-center">
            There has been an error trying to publish your post
          </p>
        )}
      </section>
    </form>
  );
}
