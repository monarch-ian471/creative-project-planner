import * as yup from 'yup';

export const EntitySchema = function() {
    return yup.object({
        status: yup.string().nullable(),
        isDeleted: yup.boolean().nullable()
    });
};

export const FormSchema = function(t) {
    return yup.object({
        firstName: yup.string().required(t('validation.mixed.required')),
        lastName: yup.string().required(t('validation.mixed.required')),
        email: yup.string().email(t('validations.string.email')).required(t('validation.mixed.required')),
        password: yup.string().required(t('validation.mixed.required')),
        phone: yup.string().required(t('validation.mixed.required')),
        address: yup.string().required(t('validation.mixed.required'))
    });
};
