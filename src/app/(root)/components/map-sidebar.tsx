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

const formSchema = z.object({
  companyName: z.string().min(0).max(255),
  restaurantType: z.string().min(0).max(9999),
  isChain: z.boolean()
})

export function MapSidebar() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { companyName: "", restaurantType: "", isChain: false },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Фильтры
            <SidebarTrigger />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название управляющей компании</FormLabel>
                      <FormControl>
                        <Input placeholder="Напишите название..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="restaurantType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Вид объекта</FormLabel>
                      <FormControl>
                        <Input placeholder="Напишите вид..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isChain"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg space-y-0">
                      <FormLabel>Является сетевым</FormLabel>
                      <FormControl>
                        <Switch
                          className="mb-2"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Применить
                </Button>
              </form>
            </Form>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}