import {database} from "../src/lib/Database";

class Seed {

    private mainDishTypeId!: number;
    private sideDishTypeId!: number;
    private dessertTypeId!: number;

    public async types() {
        await database.type.createMany({
            data: [
                { name: "Main Dish" },
                { name: "Side Dish" },
                { name: "Dessert" }
            ]
        });
    }

    public async menuItems() {

        // get type id for different types (main dishes, side dishes and desserts)
        const mainDishType = await database.type.findUnique({ where: { name: "Main Dish" } });
        const sideDishType = await database.type.findUnique({ where: { name: "Side Dish" } });
        const dessertType = await database.type.findUnique({ where: { name: "Dessert" } });

        this.mainDishTypeId = mainDishType!.id;
        this.sideDishTypeId = sideDishType!.id;
        this.dessertTypeId = dessertType!.id;

        await database.menuItem.createMany({
            data: [
                // main dishes
                { name: "Rice", price: 100, typeId: this.mainDishTypeId },
                { name: "Rotty", price: 20, typeId: this.mainDishTypeId },
                { name: "Noodles", price: 150, typeId: this.mainDishTypeId },

                // side dishes
                { name: "Wadai", price: 45, typeId: this.sideDishTypeId },
                { name: "Dhal Curry", price: 75, typeId: this.sideDishTypeId },
                { name: "Fish Curry", price: 120, typeId: this.sideDishTypeId },

                // desserts
                { name: "Watalappam", price: 40, typeId: this.dessertTypeId },
                { name: "Jelly", price: 20, typeId: this.dessertTypeId },
                { name: "Pudding", price: 25, typeId: this.dessertTypeId },

            ]
        });
    }

    public async run() {
        try {
            await this.types();
            await this.menuItems();
            console.log("Seeding worked!!!");
        } catch (error) {
            console.error("Error seeding database:", error);
        } finally {
            await database.$disconnect();
        }
    }
}

new Seed().run();