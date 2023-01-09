# frozen_string_literal: true

require './src/utils'
require './src/examples'

def main
  print_section_title('print')
  basic_print

  print_section_title('string interpolation')
  basic_string_interpolation

  print_section_title('type reflection')
  basic_type_reflection

  print_section_title('types')
  basic_types

  print_section_title('operators')
  basic_operators

  print_section_title('if')
  basic_if

  print_section_title('case')
  basic_case

  print_section_title('strings')
  basic_strings

  print_section_title('arrays')
  basic_arrays

  print_section_title('hashes')
  basic_hashes

  print_section_title('methods')
  basic_methods
end

main
