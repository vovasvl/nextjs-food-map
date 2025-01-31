import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/types";

export function RestaurantInfoPopover({ restaurant }: Readonly<{ restaurant: Restaurant}>) {

  return (
    <Card className={"w-[380px] justify-self-center"}>
      <CardHeader className={"flex !flex-row flex-wrap gap-1 !space-y-0 one"}>
        <CardDescription className={"!text-lg !text-card-foreground"}>{restaurant.Name}</CardDescription>
        <p className={"!text-lg content-center"}>
        ·
        </p>
        <CardTitle className={"!test-lg !text-muted-foreground content-center"}>{restaurant.TypeObject}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
            { restaurant.OperatingCompany &&
              <div
              className="mb-4 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="!space-y-1">
                <p className="text-sm font-medium leading-none !m-0">
                  {restaurant.OperatingCompany}
                </p>
                <p className="text-sm text-muted-foreground">
                  {"Название управляющей компании"}
                </p>
              </div>
            </div>
            }
            <div
              className="mb-4 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="!space-y-1">
                <p className="text-sm font-medium leading-none !m-0">
                  {restaurant.Address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {"Адрес"}
                </p>
              </div>
            </div>
            <div
              className="mb-4 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="!space-y-1">
                <p className="text-sm font-medium leading-none !m-0">
                  {restaurant.SeatsCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {"Число посадочных мест"}
                </p>
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}