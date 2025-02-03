'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useMapMarkersContext } from "@/contexts/MapMarkersContext"
import { fetchRestaurants } from "@/lib/fetchRestaurants"

type filterType = {
  OperatingCompany: string
  TypeObject: string
  IsNetObject: boolean
}

const filterSchema = z.object({
  OperatingCompany: z.string().min(0).max(255),
  TypeObject: z.string().min(0).max(9999),
  IsNetObject: z.boolean()
}) satisfies z.ZodType<filterType>

export function MapFilterPanel() {
  const { setMarkedRestaurants } = useMapMarkersContext();
  
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: { OperatingCompany: "", TypeObject: "", IsNetObject: false },
  })

  const formFields: {name: keyof filterType, label: string, placeholder?: string, type: "textarea" | "switch"}[] = [
    {
      name: "OperatingCompany",
      label: "Название управляющей компании",
      placeholder: "Введите часть названия компании",
      type: "textarea",
    },
    {
      name: "TypeObject",
      label: "Вид объекта",
      placeholder: "Введите часть вида объекта",
      type: "textarea",
    },
    {
      name: "IsNetObject",
      label: "Является сетевым",
      type: "switch",
    },
  ];

  async function onSubmit(values: z.infer<typeof filterSchema>) {
    try{
        const response = await fetchRestaurants({
          OperatingCompany: values.OperatingCompany,
          TypeObject: values.TypeObject,
          IsNetObject: values.IsNetObject
        });
        setMarkedRestaurants(response);
        } catch(error) {
          if(error instanceof Error){
            console.log(error.message);
          }
        }
  }

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarTrigger className="absolute right-6 top-6 z-10" />
        <SidebarGroup>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SidebarGroupContent >
                <SidebarGroupLabel className="px-4 pt-5 pb-3 inline-table w-full">
                  Фильтры
                </SidebarGroupLabel>
                {formFields.map((formField) => (
                  <FormField
                    key={formField.name}
                    control={form.control}
                    name={formField.name}
                    render={({ field }) => (
                      <FormItem className={formField.type === "switch" ?
                        "flex items-center justify-between p-4 space-y-0" :
                        "px-4 py-3"}>
                        <FormLabel>{formField.label}</FormLabel>
                        <FormControl>
                          {formField.type === "textarea" ? (
                            <Input
                              placeholder={formField.placeholder}
                              value={field.value as string}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              ref={field.ref}
                            />
                          ) : formField.type === "switch" ? (
                            <Switch
                              className="mb-2"
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          ) : null}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </SidebarGroupContent>
              <div className="flex justify-center px-4 py-3">
                <Button type="submit" className="flex-1 h-10 rounded-xl text-sm font-bold bg-color-action-primary hover:bg-color-action-primary/90">
                  Применить
                </Button>
              </div>
            </form>
          </Form>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}