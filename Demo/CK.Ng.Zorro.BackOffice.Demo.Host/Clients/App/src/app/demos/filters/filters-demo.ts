import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  DateRangeFilter,
  Filter,
  SwitchFilter,
  SelectFilter,
  LayoutContent
} from '@local/ck-gen';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface Product {
  id: number;
  name: string;
  category: string;
  inStock: boolean;
  createdAt: Date;
}

enum Category {
  Electronics = 'Electronics',
  Clothing = 'Clothing',
  Books = 'Books'
}

@Component( {
  selector: 'app-filters-demo',
  imports: [CommonModule, LayoutContent, NzButtonModule],
  templateUrl: './filters-demo.html',
  styleUrl: './filters-demo.less'
} )
export class FiltersDemo {
  allProducts: Array<Product> = [
    { id: 1, name: 'Laptop', category: Category.Electronics, inStock: true, createdAt: new Date( 2026, 1, 15 ) },
    { id: 2, name: 'T-Shirt', category: Category.Clothing, inStock: true, createdAt: new Date( 2026, 1, 10 ) },
    { id: 3, name: 'Novel', category: Category.Books, inStock: false, createdAt: new Date( 2026, 0, 25 ) },
    { id: 4, name: 'Headphones', category: Category.Electronics, inStock: true, createdAt: new Date( 2026, 1, 18 ) },
    { id: 5, name: 'Jeans', category: Category.Clothing, inStock: false, createdAt: new Date( 2025, 11, 5 ) },
    { id: 6, name: 'Cookbook', category: Category.Books, inStock: true, createdAt: new Date( 2026, 0, 1 ) },
  ];

  filteredProducts: Array<Product> = [...this.allProducts];

  filters: Array<Filter<unknown>> = [
    new SwitchFilter( 'In Stock', true, false, '' ),
    new SelectFilter<Category>(
      'multiple',
      'Category',
      [
        { label: 'Electronics', value: Category.Electronics },
        { label: 'Clothing', value: Category.Clothing },
        { label: 'Books', value: Category.Books },
      ],
      {
        defaultValue: [Category.Electronics, Category.Clothing, Category.Books],
        active: false,
        placeholder: 'Select categories'
      }
    ),
    new SelectFilter<Category>(
      'default',
      'Category (single)',
      [
        { label: 'Electronics', value: Category.Electronics },
        { label: 'Clothing', value: Category.Clothing },
        { label: 'Books', value: Category.Books },
      ],
      {
        active: false,
        placeholder: 'Select a category'
      }
    ),
    new DateRangeFilter( 'Created', {
      placeholder: ['Start date', 'End date'],
      presets: {
        'Last 7 days': () => {
          const end = new Date();
          const start = new Date();
          start.setDate( start.getDate() - 7 );
          return [start, end];
        },
        'This month': () => {
          const now = new Date();
          return [new Date( now.getFullYear(), now.getMonth(), 1 ), now];
        },
        'Last 30 days': () => {
          const end = new Date();
          const start = new Date();
          start.setDate( start.getDate() - 30 );
          return [start, end];
        }
      }
    } )
  ];

  applyFilters(): void {
    const activeFilters = this.filters.filter( f => f.active );
    if ( activeFilters.length === 0 ) {
      this.filteredProducts = [...this.allProducts];
      return;
    }

    let result = [...this.allProducts];
    activeFilters.forEach( f => {
      if ( f.label === 'In Stock' ) {
        result = result.filter( p => p.inStock === f.value );
      }
      if ( f.label === 'Category' ) {
        result = result.filter( p => ( f.value as Array<string> ).includes( p.category ) );
      }
      if ( f.label === 'Category (single)' && f.value ) {
        result = result.filter( p => p.category === f.value );
      }
      if ( f.label === 'Created' && f.value ) {
        const [start, end] = f.value as [Date, Date];
        result = result.filter( p => p.createdAt >= start && p.createdAt <= end );
      }
    } );
    this.filteredProducts = result;
  }

  clearFilters(): void {
    this.filteredProducts = [...this.allProducts];
  }
}
