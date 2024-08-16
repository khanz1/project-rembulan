import fs from 'fs/promises';
import path from 'path';

import { sequelize } from './sequelize';
import Category from './models/category.model';
import Menu from './models/menu.model';

async function seed() {
  try {
    const categoriesFilePath = path.resolve(
      __dirname,
      './data/categories.json',
    );
    const menusFilePath = path.resolve(__dirname, './data/menus.json');
    const categories = JSON.parse(
      await fs.readFile(categoriesFilePath, 'utf-8'),
    );
    const menus = JSON.parse(await fs.readFile(menusFilePath, 'utf-8'));

    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    await Category.bulkCreate(categories);
    console.log('Categories seeded');

    await Menu.bulkCreate(menus);
    console.log('Cuisines seeded');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

void seed();
