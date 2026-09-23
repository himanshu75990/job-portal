import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import useFetch from '@/hooks/use-fetch';
import { addNewCompany } from '@/api/companies';

const schema = z.object({
  name: z.string().min(1, { message: 'Company name is required' }),
  logo: z
    .any()
    .refine((file) => file[0], { message: 'Logo is required' })
    .refine(
      (file) =>
        file[0] &&
        ['image/png', 'image/jpeg', 'image/svg+xml'].includes(file[0].type),
      { message: 'Only PNG, JPG, or SVG files are allowed' }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany, {});

  const onSubmit = async (data) => {
    fnAddCompany({
      name: data.name,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          + Add Company
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-2 p-4 pb-0">
          <Input placeholder="Company name" {...register('name')} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register('logo')}
          />
          {errors.logo && (
            <p className="text-red-500 text-sm">{errors.logo.message}</p>
          )}

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>

        {errorAddCompany?.message && (
          <p className="text-red-500 text-sm px-4">{errorAddCompany?.message}</p>
        )}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
