import { FormProvider, useForm } from "react-hook-form";
import type { ComponentType } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import type { BaseSyntheticEvent } from "react";
import type { AnyObjectSchema } from "yup";
import type {
  CheckoutFieldConfig,
  CheckoutFormValues,
} from "../constants/checkoutFormConfig";

interface WithCheckoutFormOptions {
  fields: CheckoutFieldConfig[];
  schema: AnyObjectSchema;
  defaultValues: CheckoutFormValues;
  onSubmit?: (values: CheckoutFormValues) => Promise<void> | void;
}

export interface WithCheckoutFormInjectedProps {
  fields: CheckoutFieldConfig[];
  onSubmit: (event?: BaseSyntheticEvent) => void;
  isSubmitting: boolean;
}

export const withCheckoutForm = <P extends WithCheckoutFormInjectedProps>(
  WrappedComponent: ComponentType<P>,
  options: WithCheckoutFormOptions,
) => {
  const { fields, schema, defaultValues, onSubmit } = options;

  const ComponentWithForm = (
    props: Omit<P, keyof WithCheckoutFormInjectedProps>,
  ) => {
    const methods = useForm<CheckoutFormValues>({
      resolver: yupResolver(schema),
      defaultValues,
      mode: "onBlur",
    });

    const submitHandler = methods.handleSubmit(async (data) => {
      if (onSubmit) {
        await onSubmit(data);
        return;
      }
      console.table(data);
    });

    return (
      <FormProvider {...methods}>
        <WrappedComponent
          {...(props as P)}
          fields={fields}
          onSubmit={submitHandler}
          isSubmitting={methods.formState.isSubmitting}
        />
      </FormProvider>
    );
  };

  ComponentWithForm.displayName = `WithCheckoutForm(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;

  return ComponentWithForm;
};
