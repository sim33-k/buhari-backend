import { IReportRepository } from "repositories/interfaces/IReportRepository";
import { database } from "../../lib/Database";

// Daily sales revenue
// Most famous main dish
// Most famous side dish
// Which side dish is consumed most with which main dish
// API endpoints (where applicable)

export class PrismaReportRepository implements IReportRepository {

    async getDailySalesRevenue(date: String): Promise<any> {
        // SELECT SUM(Order.total) FROM "Order" WHERE DATE(Order.createdAt) = DATE($1)
        // problem is that prisma doesnt have date function
        // isntead we have to use greater than and less than

        const startDate = new Date(`${date}T00:00:00.000Z`);
        const endDate = new Date(`${date}T23:59:59.999Z`);

        const result = await database.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                date: {
                    gte: startDate, lte: endDate
                }
            }
        })

        return result;
    }

    async getFamousMainDish(): Promise<any> {
        // SELECT m.name, SUM(oi.quantity) AS total_quantity FROM OrderItem oi
        // INNER JOIN  MenuItem m ON oi.menuId = m.id
        // INNER JOIN Type t ON t.id = m.typeId
        // WHERE t.name = "Main Dish"
        // GROUP BY m.name
        // ORDER BY SUM(oi.quantity) DESC
        // LIMIT 1

        const result = await database.orderItem.groupBy({
            by: ['menuId'],
            // must include the relation
            where: {
                menu: {
                    type: {
                        name: "Main Dish"
                    }
                }
            },
            // after grouping we need the sum
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {quantity: 'desc'},

            },
            take: 1,
        })

        return result;


    }

    async getFamousSideDish(): Promise<any> {

        // same as the main dish, just the the type name changes

        const result = await database.orderItem.groupBy({
            by: ['menuId'],
            // must include the relation
            where: {
                menu: {
                    type: {
                        name: "Side Dish"
                    }
                }
            },
            // after grouping we need the sum
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {quantity: 'desc'},

            },
            take: 1,
        })

        return result;

    }

    async getFamousDessert(): Promise<any> {
        const result = await database.orderItem.groupBy({
            by: ['menuId'],
            where: {
                menu: {
                    type: {
                        name: "Dessert"
                    }
                }
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {quantity: 'desc'},

            },
            take: 1,
        })
        return result;

    }

    async getMostPopularSideDishForEachMainDish(): Promise<any> {

    // so we need to get the main - side dish combinations first
    // select m.name, s.name, COUNT(DISTINCT ois) AS combinations
    // from OrderItem oim
    // INNER JOIN MenuItem mdd ON oim.menuId = mdd.id
    // inner join Type tm on mdd.typeId = tm.id
    // // now we self join the side dish id
    // INNER JOIN OrderItem ois ON ois.orderId = oim.orderId // matching the same order
    // INNER JOIN MenuItem mds ON ois.menuId = mds.id
    // INNER JOIN Type ts ON mds.typeId = ts.id

    // where td.name = "Main Dish" AND ts.name ="Side dish" AND mdd.id <> mds.id
    // group by mdd.name, mds.name
    // ORDER BY combinations DESC
    // LIMIT 1

    
    // we first get all the main dishes
    const mainDishes = await database.menuItem.findMany({
        where: {
            type: {
                name: "Main Dish"
            }
        }

    })

    // [{id: 1, name: "Rice", price: 100, typeId: 1} ...]
    // for all the main dishes we have, we need to find orders with side dishes

    const mainDishOrders = [];

    for(const mainDish of mainDishes) {
        const orders = await database.orderItem.findMany({
            where: {
                menuId: mainDish.id
            },
            include: {
                menu: true
            }
        })

        mainDishOrders.push({mainDish: mainDish,orders: orders})

    }

    // now we iterate through all the main dish orders and find the side dishes

    const sideDishOrdersWithMainDishes = [];

    for(const mainDishOrder of mainDishOrders) {
        const sideDishOrders = await database.orderItem.findMany({
            where: {
                orderId: {
                    in: mainDishOrder.orders.map(order => order.orderId)
                },
                menu: {
                    type: {
                        name: "Side Dish"
                    }
                }
            },
            include: {
                menu: true
            }
        })

        sideDishOrdersWithMainDishes.push({
            mainDish: mainDishOrder.mainDish,
            sideDishes: sideDishOrders
        })
    }


    // now we have dish order items for each main dish

    const result = [];

    for(const row of sideDishOrdersWithMainDishes) {
        
        const counts: any = {};

        for(const item of row.sideDishes) {
            const dishName = item.menu.name;
            if(counts[dishName]) {
                counts[dishName] += item.quantity;
            } else {
                counts[dishName] = item.quantity;
            }
        }

        let maxName: string = "";
        let maxCount: number = 0;

        for(const dishName in counts) {
            if(counts[dishName] > maxCount) {
                maxCount = counts[dishName];
                maxName = dishName;
            }
        }

        result.push({
            mainDish: row.mainDish,
            mostPopularSideDish: {
                name: maxName,
                totalQuantity: maxCount
            }
        });

    }
    
    return result;
    
    }

    async getSalesHistory(startDate: string,endDate: string): Promise<any> {

        // since its easier to do with sql ill do it now, will later replace this with prisma orm
        // added the postgres function date_trunc to group by day
        // also changed the < to less than next day
        // because it wasnt showing current day orders
        const result = await database.$queryRaw`
            SELECT date_trunc('day', date) as date, SUM(total) as total FROM "Order" 
            WHERE date >= ${startDate}::timestamp 
            AND date < (${endDate}::timestamp + interval '1 day')
            GROUP BY date_trunc('day', date) 
            ORDER BY date_trunc('day', date)
        `;
        return result;
    }

}

export default PrismaReportRepository;